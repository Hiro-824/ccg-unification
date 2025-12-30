import { Grammar } from "../parser/parser";

type Category = AtomicCategory | ComplexCategory;
interface FeatureStructure {
    [key: string]: FeatureValue;
}
type FeatureValue = string | number | boolean | FeatureStructure | FeatureValue[];
type AtomicCategory = {
    kind: "AtomicCategory",
    features: FeatureStructure
};

type ComplexCategory = {
    kind: "ComplexCategory"
    direction: "/" | "\\",
    argument: Category,
    result: Category
}

const atom = (type: string, otherFeatures: Record<string, FeatureValue> = {}): AtomicCategory => ({
    kind: "AtomicCategory",
    features: { type, ...otherFeatures }
});

const complex = (result: Category, dir: "/" | "\\", arg: Category): ComplexCategory => ({
    kind: "ComplexCategory",
    direction: dir,
    argument: arg,
    result: result
});

class CategorialGrammar implements Grammar<Category> {
    words: Record<string, Category[]> = {
        "John": [atom("NP", {number: "singular", person: 3})],
        "sees": [complex(complex(atom("S"), "\\", atom("NP", {number: "singular", person: 3})), "/", atom("NP"))],
        "see": [
            complex(complex(atom("S"), "\\", atom("NP", {number: "plural"})), "/", atom("NP")),
            complex(complex(atom("S"), "\\", atom("NP", {number: "singular", person: 1})), "/", atom("NP")),
            complex(complex(atom("S"), "\\", atom("NP", {number: "singular", person: 2})), "/", atom("NP")),
        ],
        "Mary": [atom("NP", {number: "singular", person: 3})],
        "People": [atom("NP", {number: "plural", person: 3})]
    };

    getTerminalCategories(word: string): Category[] {
        return this.words[word] || [];
    }

    combine(left: Category, right: Category): Category[] {
        const categories: Category[] = [];
        const forwardApplicationResult = this.applyForward(left, right);
        const backwardApplicationResult = this.applyBackward(left, right);
        if (forwardApplicationResult !== null) categories.push(forwardApplicationResult);
        if (backwardApplicationResult !== null) categories.push(backwardApplicationResult);
        return categories;
    }

    private applyForward(left: Category, right: Category): Category | null {
        if (this.isComplex(left) && left.direction === "/" && this.isEqual(left.argument, right)) return left.result;
        return null;
    }

    private applyBackward(left: Category, right: Category): Category | null {
        if (this.isComplex(right) && right.direction === "\\" && this.isEqual(right.argument, left)) return right.result;
        return null;
    }

    private isComplex(c: Category): c is ComplexCategory {
        return c.kind === "ComplexCategory";
    }

    private isEqual(c1: Category, c2: Category): boolean {
        if (!this.isComplex(c1) && !this.isComplex(c2)) {
            return this.canUnify(c1.features, c2.features);
        }
        if (this.isComplex(c1) && this.isComplex(c2)) {
            return (c1.direction === c2.direction && this.isEqual(c1.argument, c2.argument) && this.isEqual(c1.result, c2.result))
        }
        return false
    }

    private isFeatureStructure(value: FeatureValue): value is FeatureStructure {
        return (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
        );
    }

    private canUnify(a: FeatureValue, b: FeatureValue): boolean {
        if (a === b) return true;

        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            return a.every((val, i) => this.canUnify(val, b[i]));
        }

        if (this.isFeatureStructure(a) && this.isFeatureStructure(b)) {
            for (const key of Object.keys(a)) {
                if (key in b) {
                    if (!this.canUnify(a[key], b[key])) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }
}

export const complexCategorialGrammar = new CategorialGrammar();