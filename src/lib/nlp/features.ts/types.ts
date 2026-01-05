export type TypeName = string;
export type KeyName = string;
export type FeatureStructure = Record<KeyName, TypedFeatureStructure>

export type TypedFeatureStructure = {
    kind: "TypedFeatureStructure"
    typeName: TypeName,
    features: FeatureStructure
}

export type TypeDefinition = {
    kind: "TypeDefinition"
    typeName: TypeName,
    parentTypes: TypeName[],
    appropriateFeatures: Record<KeyName, TypeName>
}