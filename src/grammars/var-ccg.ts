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

const v = (id: string): Variable => ({ kind: "Variable", id });

class CategorialGrammar implements Grammar<Category> {
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
        "dog":  [atom("NP", { num: "sg" })],
        "run":  [complex(atom("S"), "\\", atom("NP", { num: "pl" }))],
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
        return categories.map(cat => this.renameVariables(cat));
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

    private renameVariables(cat: Category): Category {
        const mapping = new Map<string, string>();
        
        const copyAndRename = (val: FeatureValue): FeatureValue => {
            if (this.isVariable(val)) {
                if (!mapping.has(val.id)) {
                    this.variableCounter++;
                    mapping.set(val.id, `${val.id}_${this.variableCounter}`);
                }
                return { kind: "Variable", id: mapping.get(val.id)! };
            }
            
            if (Array.isArray(val)) {
                return val.map(v => copyAndRename(v));
            }
            
            if (this.isFeatureStructure(val)) {
                const newFS: FeatureStructure = {};
                for (const k in val) {
                    newFS[k] = copyAndRename(val[k]);
                }
                return newFS;
            }
            
            return val;
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
                    features: copyAndRename(c.features) as FeatureStructure
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
                features: this.applySubstitutionToStructure(input.features, env) as FeatureStructure
            };
        }
    }

    private applySubstitutionToStructure(val: FeatureValue, env: Environment): FeatureValue {
        const resolved = this.resolve(val, env);
        if (this.isVariable(resolved)) {
            return resolved;
        }
        if (Array.isArray(resolved)) {
            return resolved.map(item => this.applySubstitutionToStructure(item, env));
        }
        if (this.isFeatureStructure(resolved)) {
            const newFS: FeatureStructure = {};
            for (const key in resolved) {
                newFS[key] = this.applySubstitutionToStructure(resolved[key], env);
            }
            return newFS;
        }
        return resolved;
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
            const u = this.unify(c1.features, c2.features, env);
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