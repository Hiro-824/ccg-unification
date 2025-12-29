import { UnificationEnvironment } from "./env";
import { FeatureValue, isFeatureStructure, isVar, } from "./types";

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

    // Identity check
    if (a1 === b1) return true;

    // 1. Variable Binding
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

    // 2. Feature Structures
    if (isFeatureStructure(a1) && isFeatureStructure(b1)) {
        const allKeys = new Set([
            ...Object.keys(a1.features),
            ...Object.keys(b1.features),
        ]);

        for (const k of allKeys) {
            const v1 = a1.features[k];
            const v2 = b1.features[k];

            if (v1 !== undefined && v2 !== undefined) {
                if (!unify(v1, v2, env)) return false;
            } else if (v1 === undefined && v2 !== undefined) {
                a1.features[k] = v2;
            }
        }

        // OPTIONAL BUT RECOMMENDED: 
        // Technically, a1 and b1 are now "unified". In a graph system, they should point to the same node.
        // Since we can't easily change pointers of objects in JS without a wrapper,
        // we often assume that because we merged b1 into a1, a1 is the "result".
        // But if b1 is referenced elsewhere, it won't see a1's new features.
        // A strict "Union-Find" for objects is complex. 
        // A simple trick: Bind b1 to a1 in the environment ONLY IF b1 was a root object in this scope.
        // But since b1 is not a Var, we can't bind it in 'bindings' (which maps string IDs).

        // PRACTICAL SOLUTION FOR TYPESCRIPT PARSERS:
        // Ensure that 'renameApart' creates a fresh deep copy. 
        // Then, mutation of 'a1' is acceptable because 'a1' is unique to this parse branch.

        return true;
    }

    // 3. Arrays
    if (Array.isArray(a1) && Array.isArray(b1)) {
        if (a1.length !== b1.length) return false;
        for (let i = 0; i < a1.length; i++) {
            if (!unify(a1[i], b1[i], env)) return false;
        }
        return true;
    }

    // 4. Atomics
    if (typeof a1 !== "object" && typeof b1 !== "object") {
        return a1 === b1;
    }

    return false;
}