import { Environment, FeatureStructure, FeatureSystem, FeatureValue, Variable } from "../feature/feature";
import { Grammar } from "../parser/parser";

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

const v = (id: string): Variable => ({ kind: "Variable", id });

class CategorialGrammar implements Grammar<Category> {

    private fs = new FeatureSystem();

    words: Record<string, Category[]> = {
        "John": [atom("NP", { num: "sg", pers: 3, gender: "m" })],
        "Mary": [atom("NP", { num: "sg", pers: 3, gender: "f" })],
        "sees": [
            complex(
                complex(atom("S"), "\\", atom("NP", { num: "sg", pers: 3, index: v("s") })),
                "/",
                atom("NP", { index: v("o") })
            )
        ],
        "himself": [
            complex(
                complex(atom("S"), "\\", atom("NP", { index: v("x"), gender: "m" })),
                "\\",
                complex(
                    complex(atom("S"), "\\", atom("NP", { index: v("x") })),
                    "/",
                    atom("NP", { index: v("x") })
                )
            )
        ],
        "dogs": [atom("NP", { num: "pl" })],
        "dog": [atom("NP", { num: "sg" })],
        "run": [complex(atom("S"), "\\", atom("NP", { num: "pl" }))],
        "runs": [complex(atom("S"), "\\", atom("NP", { num: "sg" }))],
        "that": [
            complex(
                // Result: NP[?x] \ NP[?x]  (名詞修飾語)
                complex(
                    atom("NP", { num: v("x") }),
                    "\\",
                    atom("NP", { num: v("x") })
                ),
                "/",
                // Argument: S \ NP[?x] (主語が欠けた動詞句)
                complex(
                    atom("S"),
                    "\\",
                    atom("NP", { num: v("x") })
                )
            )
        ],
    };

    getTerminalCategories(word: string): Category[] {
        const categories = this.words[word] || [];
        return categories.map(cat => this.renameVariablesInCategory(cat));
    }

    combine(left: Category, right: Category): Category[] {
        const categories: Category[] = [];

        const forwardApplicationResult = this.applyForward(left, right);
        if (forwardApplicationResult.result !== null) categories.push(this.applySubstitution(forwardApplicationResult.result, forwardApplicationResult.env));

        const backwardApplicationResult = this.applyBackward(left, right);
        if (backwardApplicationResult.result !== null) categories.push(this.applySubstitution(backwardApplicationResult.result, backwardApplicationResult.env));

        return categories;
    }

    private variableCounter = 0;

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

    applySubstitution(input: Category, env: Environment): Category {
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

export const complexCategorialGrammar = new CategorialGrammar();