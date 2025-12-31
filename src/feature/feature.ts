export interface FeatureStructure {
    [key: string]: FeatureValue;
}
export type Variable = { kind: "Variable", id: string };
export type FeatureValue = string | number | boolean | FeatureStructure | FeatureValue[] | Variable;
export type Environment = Record<string, FeatureValue>;

export class FeatureSystem {

    applySubstitutionToStructure(val: FeatureValue, env: Environment): FeatureValue {
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

    isFeatureStructure(value: FeatureValue): value is FeatureStructure {
        return (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
        );
    }

    isVariable(value: FeatureValue): value is Variable {
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

    unify(a: FeatureValue, b: FeatureValue, originalEnv: Environment): { result: FeatureValue | null, env: Environment } {

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