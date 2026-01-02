import { Unifier } from "../ccg/grammar"
import { FeatureStructure, Environment, FeatureValue, Variable } from "./types";

export class FeatureStructureUnifier implements Unifier<FeatureStructure, Environment> {

    private variableCounter = 0;

    createEmptyEnv(): Environment {
        return {};
    }

    unify(a: FeatureStructure, b: FeatureStructure, prev: Environment): Environment | null {
        const result = this.unifyValues(a, b, prev);
        if (result.result === null) {
            return null;
        }
        return result.env;
    }

    apply(a: FeatureStructure, env: Environment): FeatureStructure {
        return this.applyToValue(a, env) as FeatureStructure;
    }

    refresh(a: FeatureStructure): FeatureStructure {
        const mapping = new Map<string, string>();
        const generateId = () => {
            this.variableCounter++;
            return `var_${this.variableCounter}`;
        };
        return this.refreshValue(a, mapping, generateId) as FeatureStructure;
    }

    private isVariable(value: FeatureValue): value is Variable {
        return (
            typeof value === "object" &&
            "kind" in value &&
            value.kind === "Variable"
        );
    }

    private isFeatureStructure(value: FeatureValue): value is FeatureStructure {
        return (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) &&
            !('kind' in value && value.kind === 'Variable')
        );
    }

    private unifyValues(a: FeatureValue, b: FeatureValue, prev: Environment): { result: FeatureValue | null, env: Environment } {
        let env: Environment = { ...prev };

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
                const u = this.unifyValues(a[i], b[i], env);
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
                    const u = this.unifyValues(a[key], b[key], env);
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

    private refreshValue(
        val: FeatureValue,
        mapping: Map<string, string>,
        idGenerator: () => string
    ): FeatureValue {
        if (this.isVariable(val)) {
            if (!mapping.has(val.id)) {
                mapping.set(val.id, idGenerator());
            }
            return { kind: "Variable", id: mapping.get(val.id)! };
        }

        if (Array.isArray(val)) {
            return val.map(v => this.refreshValue(v, mapping, idGenerator));
        }

        if (this.isFeatureStructure(val)) {
            const newFS: FeatureStructure = {};
            for (const k in val) {
                newFS[k] = this.refreshValue(val[k], mapping, idGenerator);
            }
            return newFS;
        }
        return val;
    }

    private applyToValue(val: FeatureValue, env: Environment): FeatureValue {
        const resolved = this.resolve(val, env);
        if (this.isVariable(resolved)) {
            return resolved;
        }
        if (Array.isArray(resolved)) {
            return resolved.map(item => this.applyToValue(item, env));
        }
        if (this.isFeatureStructure(resolved)) {
            const newFS: FeatureStructure = {};
            for (const key in resolved) {
                newFS[key] = this.applyToValue(resolved[key], env);
            }
            return newFS;
        }
        return resolved;
    }

    // 意地悪なデータ入れたら無限ループになるかも
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
}