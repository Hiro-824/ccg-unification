export type AtomicValue = string | number | boolean;

export type Var = {
    kind: "Var";
    id: string;
    name?: string;
};

export type FeatureStructure = {
    kind: "FeatureStructure";
    type?: string;
    features: Record<string, FeatureValue>;
};

export type FeatureValue =
    | FeatureStructure
    | AtomicValue
    | Var
    | FeatureValue[];

export function isVar(value: FeatureValue): value is Var {
    return (typeof value === 'object' && value !== null && 'kind' in value && value.kind === 'Var');
}

export function isFeatureStructure(value: FeatureValue): value is FeatureStructure {
    return (typeof value === 'object' && value !== null && 'kind' in value && value.kind === 'FeatureStructure');
}