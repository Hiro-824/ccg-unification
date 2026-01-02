export interface FeatureStructure {
    [key: string]: FeatureValue;
}
export type Variable = { kind: "Variable", id: string };
export type FeatureValue = string | number | boolean | FeatureStructure | FeatureValue[] | Variable;
export type Environment = Record<string, FeatureValue>;