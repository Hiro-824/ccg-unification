import { Grammar } from "../parser/parser";

interface FeatureStructure {
    [key: string]: FeatureValue;
}
type Variable = { kind: "Variable", id: string };
type FeatureValue = string | number | boolean | FeatureStructure | FeatureValue[] | Variable;
type Environment = Record<string, FeatureValue>;

type Category = AtomicCategory | ComplexCategory;

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
        "John": [atom("NP", { number: "singular", person: 3 })],
        "sees": [complex(complex(atom("S"), "\\", atom("NP", { number: "singular", person: 3 })), "/", atom("NP"))],
        "see": [
            complex(complex(atom("S"), "\\", atom("NP", { number: "plural" })), "/", atom("NP")),
            complex(complex(atom("S"), "\\", atom("NP", { number: "singular", person: 1 })), "/", atom("NP")),
            complex(complex(atom("S"), "\\", atom("NP", { number: "singular", person: 2 })), "/", atom("NP")),
        ],
        "Mary": [atom("NP", { number: "singular", person: 3 })],
        "People": [atom("NP", { number: "plural", person: 3 })]
    };

    getTerminalCategories(word: string): Category[] {
        return this.words[word] || [];
    }

    combine(left: Category, right: Category): Category[] {
        const categories: Category[] = [];
        const forwardApplicationResult = this.applyForward(left, right);
        const backwardApplicationResult = this.applyBackward(left, right);
        if (forwardApplicationResult.result !== null) categories.push(forwardApplicationResult.result);
        if (backwardApplicationResult.result !== null) categories.push(backwardApplicationResult.result);
        return categories;
    }

    private applyForward(left: Category, right: Category): { result: Category | null, env: Environment } {
        if(!this.isComplex(left)) return { result: null, env: {} };
        const u = this.unifyCategory(left.argument, right, {});
        if (left.direction === "/" && u !== null) return {result: left.result, env: u};
        return { result: null, env: {} };
    }

    private applyBackward(left: Category, right: Category): { result: Category | null, env: Environment } {
        if(!this.isComplex(right)) return { result: null, env: {} };
        const u = this.unifyCategory(right.argument, left, {});
        if (right.direction === "\\" && u !== null) return {result: right.result, env: u};
        return { result: null, env: {} };
    }

    private isComplex(c: Category): c is ComplexCategory {
        return c.kind === "ComplexCategory";
    }

    private unifyCategory(c1: Category, c2: Category, env: Environment): Environment | null {
        if (!this.isComplex(c1) && !this.isComplex(c2)) {
            const u = this.unify(c1.features, c2.features, env);
            if (u.result) {
                return u.env
            } else {
                return null;
            }
        }
        if (this.isComplex(c1) && this.isComplex(c2)) {
            if (c1.direction !== c2.direction) return null;

            const envAfterArg = this.unifyCategory(c1.argument, c2.argument, env);
            if (!envAfterArg) return null;

            const envAfterRes = this.unifyCategory(c1.result, c2.result, envAfterArg);
            return envAfterRes;
        }
        return null
    }

    private isFeatureStructure(value: FeatureValue): value is FeatureStructure {
        return (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
        );
    }

    private isVariable(value: FeatureValue): value is Variable {
        return (
            typeof value === "object" &&
            "kind" in value &&
            value.kind === "Variable"
        );
    }

    private resolve(value: FeatureValue, env: Environment): FeatureValue {
        if (this.isVariable(value)) {
            if (value.id in env) {
                const boundValue = env[value.id];
                return this.resolve(boundValue, env);
            } else {
                return value;
            }
        } else {
            return value;
        }
    }

    private unify(a: FeatureValue, b: FeatureValue, originalEnv: Environment): { result: FeatureValue | null, env: Environment } {

        let env: Environment = JSON.parse(JSON.stringify(originalEnv));

        a = this.resolve(a, env);
        b = this.resolve(b, env);

        if (this.isVariable(a) && this.isVariable(b)) {
            env[a.id] = b;
            return { result: b, env: env };
        } else if (this.isVariable(a)) {
            env[a.id] = b;
            return { result: b, env: env };
        } else if (this.isVariable(b)) {
            env[b.id] = a;
            return { result: a, env: env };
        }

        if (a === b) return { result: a, env: env };

        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return { result: null, env: env };
            const newArray: FeatureValue[] = [];
            for (let i = 0; i < a.length; i++) {
                const u = this.unify(a[i], b[i], env);
                if (u.result === null) return { result: null, env: env };
                env = u.env;
                newArray.push(u.result);
            }
            return { result: newArray, env: env };
        }

        if (this.isFeatureStructure(a) && this.isFeatureStructure(b)) {
            const newFeatures: FeatureStructure = {};
            for (const key in a) {
                if (key in b) {
                    const u = this.unify(a[key], b[key], env);
                    if (u.result === null) return { result: null, env: env };
                    env = u.env;
                    newFeatures[key] = u.result;
                } else {
                    newFeatures[key] = a[key];
                }
            }
            for (const key in b) {
                if (!(key in a)) {
                    newFeatures[key] = b[key];
                }
            }
            return { result: newFeatures, env: env };
        }
        return { result: null, env: env };
    }
}

export const complexCategorialGrammar = new CategorialGrammar();