import { Category } from "../category";
import { FeatureValue, FeatureStructure, Var, isFeatureStructure, isVar } from "./types";

// Helper to generate fresh IDs
let varCounter = 0;
const freshId = () => `_v${varCounter++}`;

export function renameApart(
    cat: Category, 
    mapping: Map<string, Var> = new Map()
): Category {
    if (cat.kind === "Atomic") {
        return {
            kind: "Atomic",
            fs: copyFS(cat.fs, mapping)
        };
    } else {
        return {
            kind: "Complex",
            direction: cat.direction,
            result: renameApart(cat.result, mapping),
            argument: renameApart(cat.argument, mapping)
        };
    }
}

function copyFS(fs: FeatureStructure, mapping: Map<string, Var>): FeatureStructure {
    const newFeatures: Record<string, FeatureValue> = {};
    for (const [key, val] of Object.entries(fs.features)) {
        newFeatures[key] = copyValue(val, mapping);
    }
    return {
        kind: "FeatureStructure",
        type: fs.type,
        features: newFeatures
    };
}

function copyValue(val: FeatureValue, mapping: Map<string, Var>): FeatureValue {
    if (isVar(val)) {
        if (!mapping.has(val.id)) {
            mapping.set(val.id, { kind: "Var", id: freshId(), name: val.name });
        }
        return mapping.get(val.id)!;
    }
    if (isFeatureStructure(val)) {
        return copyFS(val, mapping);
    }
    if (Array.isArray(val)) {
        return val.map(v => copyValue(v, mapping));
    }
    return val; // Atomic
}