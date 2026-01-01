import { FeatureValue, Variable } from "../feature/feature";
import { AtomicCategory, Category, ComplexCategory } from "./types";

export const atom = (type: string, otherFeatures: Record<string, FeatureValue> = {}): AtomicCategory => ({
    kind: "AtomicCategory",
    features: { type, ...otherFeatures }
});

export const complex = (result: Category, dir: "/" | "\\", arg: Category): ComplexCategory => ({
    kind: "ComplexCategory",
    direction: dir,
    argument: arg,
    result: result
});

export const v = (id: string): Variable => ({ kind: "Variable", id });

export class Lexicon {
    private entries: Map<string, Category[]> = new Map();

    add(word: string, categories: Category[]) {
        if (!this.entries.has(word)) {
            this.entries.set(word, []);
        }
        this.entries.get(word)!.push(...categories);
    }

    get(word: string): Category[] {
        return this.entries.get(word) || [];
    }

    load(data: Record<string, Category[]>) {
        for (const [word, cats] of Object.entries(data)) {
            this.add(word, cats);
        }
    }
}