import { Grammar } from "../../core/parser";
import { FeatureStructure } from "../../features/features";
import { TypeSystem } from "../../features/types";

export class HPSG implements Grammar<FeatureStructure> {

    types: TypeSystem = new TypeSystem();

    typeDefinition = {
        "exp-list": { parent: "top" },
        "exp-list-empty": { parent: "exp-list" },
        "exp-list-cons": { parent: "exp-list", features: { "FIRST": "expression", "REST": "exp-list" } },

        "per": { parent: "top" },
        "1st": { parent: "per" },
        "2nd": { parent: "per" },
        "3rd": { parent: "per" },

        "num": { parent: "top" },
        "sg": { parent: "num" },
        "pl": { parent: "num" },

        "gend": { parent: "top" },
        "fem": { parent: "gend" },
        "masc": { parent: "gend" },
        "neut": { parent: "gend" },

        "bool": { parent: "top" },
        "+": { parent: "bool" },
        "-": { parent: "bool" },

        "case": { parent: "top" },
        "nom": { parent: "case" },
        "acc": { parent: "case" },

        "syn-cat": { parent: "top", features: { "HEAD": "pos", "VAL": "val-cat" } },
        "val-cat": { parent: "top", features: { "SPR": "exp-list", "COMPS": "exp-list", "MOD": "exp-list" } },
        "sem-cat": { parent: "top" },

        "expression": { parent: "top", features: { "SYN": "syn-cat", "SEM": "sem-cat" } },
        "word": { parent: "expression" },
        "phrase": { parent: "expression" },

        "agr-cat": { parent: "top", features: { "PER": "per", "NUM": "num" } },
        "3sing": { parent: "agr-cat", features: { "PER": "3rd", "NUM": "sg", "GEND": "gend" } },
        "non-3sing": { parent: "agr-cat" },
        "1sing": { parent: "non-3sing", features: { "PER": "1st", "NUM": "sg" } },
        "non-1sing": { parent: "non-3sing" },
        "2sing": { parent: "non-1sing", features: { "PER": "2nd", "NUM": "sg" } },
        "plural": { parent: "non-1sing", features: { "NUM": "pl" } },

        "pos": { parent: "top" },
        "adj": { parent: "pos" },
        "prep": { parent: "pos" },
        "adv": { parent: "pos" },
        "conj": { parent: "pos" },
        "agr-pos": { parent: "pos", features: { "AGR": "agr-cat" } },
        "verb": { parent: "agr-pos", features: { "AUX": "bool" } },
        "noun": { parent: "agr-pos", features: { "CASE": "case" } },
        "det": { parent: "agr-pos", features: { "COUNT": "bool" } },
    };

    constructor() {
        this.types.loadDefinition(this.typeDefinition);
    }

    getAvailableWords(): string[] {
        throw new Error("Method not implemented.");
    }

    getTerminalCategories(word: string): FeatureStructure[] {
        throw new Error("Method not implemented.");
    }

    combine(left: FeatureStructure, right: FeatureStructure): { categories: FeatureStructure[]; rule: string; } | null {
        throw new Error("Method not implemented.");
    }
}