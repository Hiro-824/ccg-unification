import { Environment, FeatureStructure, FeatureSystem } from "../feature/feature";
import { Grammar } from "../parser/parser";
import { Category, ComplexCategory } from "../lexicon/types";
import { complex, Lexicon } from "../lexicon/lexicon";

export class CombinatoryCategorialGrammar implements Grammar<Category> {

    private fs = new FeatureSystem();
    private variableCounter = 0;
    private lexicon: Lexicon;

    constructor(lexicon: Lexicon) {
        this.lexicon = lexicon;
    }
    getTerminalCategories(word: string): Category[] {
        const categories = this.lexicon.get(word);
        return categories.map(cat => this.renameVariablesInCategory(cat));
    }

    combine(left: Category, right: Category): Category[] {
        const categories: Category[] = [];

        const forwardApplicationResult = this.applyForward(left, right);
        if (forwardApplicationResult.result !== null) categories.push(this.applySubstitution(forwardApplicationResult.result, forwardApplicationResult.env));

        const backwardApplicationResult = this.applyBackward(left, right);
        if (backwardApplicationResult.result !== null) categories.push(this.applySubstitution(backwardApplicationResult.result, backwardApplicationResult.env));

        const composedForwardResult = this.composeForward(left, right);
        if (composedForwardResult.result !== null) categories.push(this.applySubstitution(composedForwardResult.result, composedForwardResult.env));

        const composedBackwardResult = this.composeBackward(left, right);
        if (composedBackwardResult.result !== null) categories.push(this.applySubstitution(composedBackwardResult.result, composedBackwardResult.env));

        return categories;
    }

    private applyForward(left: Category, right: Category): { result: Category | null, env: Environment } {
        if (!this.isComplex(left)) return { result: null, env: {} };
        const u = this.unifyCategory(left.argument, right, {});
        if (left.direction === "/" && u !== null) return { result: left.result, env: u };
        return { result: null, env: {} };
    }

    private applyBackward(left: Category, right: Category): { result: Category | null, env: Environment } {
        if (!this.isComplex(right)) return { result: null, env: {} };
        const u = this.unifyCategory(right.argument, left, {});
        if (right.direction === "\\" && u !== null) return { result: right.result, env: u };
        return { result: null, env: {} };
    }

    private composeForward(left: Category, right: Category): { result: Category | null, env: Environment } {
        if (!this.isComplex(left) || !this.isComplex(right)) return { result: null, env: {} };
        if (left.direction !== "/" || right.direction !== "/") return { result: null, env: {} };
        const u = this.unifyCategory(left.argument, right.result, {});
        if(u !== null) {
            const result = complex(left.result, "/", right.argument);
            return { result: result, env: u };
        };
        return { result: null, env: {} };
    }

    private composeBackward(left: Category, right: Category): { result: Category | null, env: Environment } {
        if (!this.isComplex(left) || !this.isComplex(right)) return { result: null, env: {} };
        if (left.direction !== "\\" || right.direction !== "\\") return { result: null, env: {} };
        const u = this.unifyCategory(left.result, right.argument, {});
        if(u !== null) {
            const result = complex(right.result, "\\", left.argument);
            return { result: result, env: u };
        }
        return { result: null, env: {} };
    }

    private isComplex(c: Category): c is ComplexCategory {
        return c.kind === "ComplexCategory";
    }

    private unifyCategory(c1: Category, c2: Category, env: Environment): Environment | null {
        if (!this.isComplex(c1) && !this.isComplex(c2)) {
            const u = this.fs.unify(c1.features, c2.features, env);
            if (u.result !== null) {
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

    private renameVariablesInCategory(cat: Category): Category {
        const mapping = new Map<string, string>();

        const generateId = () => {
            this.variableCounter++;
            return `var_${this.variableCounter}`;
        };

        const traverseCategory = (c: Category): Category => {
            if (this.isComplex(c)) {
                return {
                    kind: "ComplexCategory",
                    direction: c.direction,
                    argument: traverseCategory(c.argument),
                    result: traverseCategory(c.result)
                };
            } else {
                return {
                    kind: "AtomicCategory",
                    features: this.fs.renameVariablesInValue(c.features, mapping, generateId) as FeatureStructure
                };
            }
        };

        return traverseCategory(cat);
    }

    private applySubstitution(input: Category, env: Environment): Category {
        if (this.isComplex(input)) {
            return {
                kind: "ComplexCategory",
                direction: input.direction,
                argument: this.applySubstitution(input.argument, env), // 再帰
                result: this.applySubstitution(input.result, env)      // 再帰
            };
        } else {
            return {
                kind: "AtomicCategory",
                features: this.fs.applySubstitutionToStructure(input.features, env) as FeatureStructure
            };
        }
    }
}