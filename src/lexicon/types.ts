import { FeatureStructure } from "../feature/feature";

export type Category = AtomicCategory | ComplexCategory;

export type AtomicCategory = {
    kind: "AtomicCategory",
    features: FeatureStructure
};

export type ComplexCategory = {
    kind: "ComplexCategory"
    direction: "/" | "\\",
    argument: Category,
    result: Category
}