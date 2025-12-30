import { Grammar } from "../parser/parser";

type Category = AtomicCategory | ComplexCategory;
type AtomicCategory = string;
type ComplexCategory = {
    direction: "/" | "\\",
    argument: Category,
    result: Category
}

class CategorialGrammar implements Grammar<Category> {
    words: Record<string, Category[]> = {
        "John": ["NP"],
        "sees": [{
            direction: "/",
            argument: "NP",
            result: {
                direction: "\\",
                argument: "NP",
                result: "S"
            }
        }],
        "Mary": ["NP"],
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
        return typeof c !== "string";
    }

    private isEqual(c1: Category, c2: Category): boolean {
        if (!this.isComplex(c1) && !this.isComplex(c2)) {
            return c1 === c2;
        }
        if (this.isComplex(c1) && this.isComplex(c2)) {
            return (c1.direction === c2.direction && this.isEqual(c1.argument, c2.argument) && this.isEqual(c1.result, c2.result))
        }
        return false
    }
}

export const categorialGrammar = new CategorialGrammar();