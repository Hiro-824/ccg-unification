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