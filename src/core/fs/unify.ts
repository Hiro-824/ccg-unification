import { UnificationEnvironment } from "./env";
import { FeatureStructure, FeatureValue, Var } from "./types";

function isVar(value: FeatureValue): value is Var {
    return (typeof value === 'object' && value !== null && 'kind' in value && value.kind === 'Var');
}

function isFeatureStructure(value: FeatureValue): value is FeatureStructure {
    return (typeof value === 'object' && value !== null && 'kind' in value && value.kind === 'FeatureStructure');
}

export function deref(
    value: FeatureValue,
    env: UnificationEnvironment,
    seen: Set<string> = new Set()
): FeatureValue {
    if (!isVar(value)) return value;

    if (seen.has(value.id)) return value;
    seen.add(value.id);

    if (!env.bindings.has(value.id)) return value;

    const bound = env.bindings.get(value.id)!;
    const resolved = deref(bound, env, seen);

    env.bindings.set(value.id, resolved);

    return resolved;
}

export function occursCheck(
    varId: string,
    value: FeatureValue,
    env: UnificationEnvironment,
    seenVars: Set<string> = new Set(),
    seenFS: Set<object> = new Set()
): boolean {
    const v = deref(value, env);

    if (isVar(v)) {
        if (seenVars.has(v.id)) return false;
        seenVars.add(v.id);
        return v.id === varId;
    }

    if (isFeatureStructure(v)) {
        if (seenFS.has(v)) return false;
        seenFS.add(v);

        for (const child of Object.values(v.features)) {
            if (occursCheck(varId, child, env, seenVars, seenFS)) return true;
        }
        return false;
    }

    if (Array.isArray(v)) {
        for (const item of v) {
            if (occursCheck(varId, item, env, seenVars, seenFS)) return true;
        }
        return false;
    }

    // AtomicValue
    return false;
}

export function unify(
    a: FeatureValue,
    b: FeatureValue,
    env: UnificationEnvironment
): boolean {
    const a1 = deref(a, env);
    const b1 = deref(b, env);

    // Same object or same unbound Var
    if (a1 === b1) return true;

    // Var cases
    if (isVar(a1)) {
        if (occursCheck(a1.id, b1, env)) return false;
        env.bindings.set(a1.id, b1);
        return true;
    }

    if (isVar(b1)) {
        if (occursCheck(b1.id, a1, env)) return false;
        env.bindings.set(b1.id, a1);
        return true;
    }

    // Atomic values
    if (
        typeof a1 !== "object" &&
        typeof b1 !== "object"
    ) {
        return a1 === b1;
    }

    // Feature structures
    if (isFeatureStructure(a1) && isFeatureStructure(b1)) {
        const keys = new Set([
            ...Object.keys(a1.features),
            ...Object.keys(b1.features),
        ]);

        for (const k of keys) {
            const v1 = a1.features[k];
            const v2 = b1.features[k];
            if (v1 === undefined || v2 === undefined) continue;
            if (!unify(v1, v2, env)) return false;
        }
        return true;
    }

    // Arrays
    if (Array.isArray(a1) && Array.isArray(b1)) {
        if (a1.length !== b1.length) return false;
        for (let i = 0; i < a1.length; i++) {
            if (!unify(a1[i], b1[i], env)) return false;
        }
        return true;
    }

    // Mismatched types
    return false;
}