import { FeatureStructure } from "./fs";

export type AtomicCategory = {
    kind: "Atomic";
    fs: FeatureStructure;
};

export type ComplexCategory = {
    kind: "Complex";
    direction: "/" | "\\";
    argument: Category;
    result: Category;
};

export type Category = AtomicCategory | ComplexCategory;