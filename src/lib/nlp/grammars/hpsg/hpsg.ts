import { Grammar } from "../../core/parser";
import { FeatureStructure, FeatureStructureInput } from "../../features/features";
import { TypeSystem } from "../../features/types";
import { lexiconData, LexiconDefinition } from "./lexicon";
import { ruleData } from "./rules";

export class HPSG implements Grammar<FeatureStructure> {

    types: TypeSystem = new TypeSystem();
    private _lexicon: Map<string, FeatureStructure[]> = new Map();
    private _rules: Map<string, FeatureStructure> = new Map();

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

        "rule-schema": { parent: "top", features: { "MOTHER": "expression", "HEAD-DTR": "expression", "NON-HEAD-DTR": "expression" } },
    };

    loadLexicon(definition: LexiconDefinition): void {
        for (const [word, fsDefs] of Object.entries(definition)) {
            const fsList: FeatureStructure[] = [];

            for (const fsDef of fsDefs) {
                try {
                    const fs = FeatureStructure.fromJSON(fsDef, this.types);
                    fsList.push(fs);
                } catch (e) {
                    console.error(`Error loading lexical entry for word "${word}":`, e);
                }
            }

            const existing = this._lexicon.get(word);
            if (existing) {
                existing.push(...fsList);
            } else {
                this._lexicon.set(word, fsList);
            }
        }
    }

    loadRules(schemas: Record<string, FeatureStructureInput>) {
        for (const [name, schema] of Object.entries(schemas)) {
            try {
                const fs = FeatureStructure.fromJSON(schema, this.types);
                this._rules.set(name, fs);
            } catch (e) {
                console.error(`Failed to load rule ${name}:`, e);
            }
        }
    }

    constructor() {
        this.types.loadDefinition(this.typeDefinition);
        this.loadLexicon(lexiconData);
        this.loadRules(ruleData);
    }

    getAvailableWords(): string[] {
        return Array.from(this._lexicon.keys());
    }

    getTerminalCategories(word: string): FeatureStructure[] {
        const masters = this._lexicon.get(word);
        if (!masters) return [];

        return masters.map(fs => fs.deepCopy(new Map(), this.types));
    }

    combine(left: FeatureStructure, right: FeatureStructure): { categories: FeatureStructure[]; rule: string; } | null {
        const results: FeatureStructure[] = [];

        for (const [ruleName, ruleSchema] of this._rules.entries()) {
            const context = new Map<FeatureStructure, FeatureStructure>();
            
            const schema = ruleSchema.deepCopy(context, this.types);
            const leftCopy = left.deepCopy(context, this.types);
            const rightCopy = right.deepCopy(context, this.types);

            let targetHead: FeatureStructure; 
            let targetNonHead: FeatureStructure;
            let targetMother: FeatureStructure;

            let candidateHead: FeatureStructure;
            let candidateNonHead: FeatureStructure;

            try {
                targetHead = schema.get("HEAD-DTR")!;
                targetNonHead = schema.get("NON-HEAD-DTR")!;
                targetMother = schema.get("MOTHER")!;
            } catch (e) {
                console.error(`Invalid rule schema: ${ruleName}, ${e}`);
                continue;
            }

            if (ruleName === "head-complement") {
                candidateHead = leftCopy;
                candidateNonHead = rightCopy;
            } else if (ruleName === "head-specifier") {
                candidateHead = rightCopy;
                candidateNonHead = leftCopy;
            } else if (ruleName === "head-modifier") {
                 candidateHead = leftCopy;
                 candidateNonHead = rightCopy;
            } else {
                continue; // 未対応のルール
            }

            try {
                FeatureStructure.unify(targetHead, candidateHead, this.types);
                FeatureStructure.unify(targetNonHead, candidateNonHead, this.types);
                console.log(`Rule applied: ${ruleName}`);
                results.push(targetMother);
            } catch (e) {
                console.log(`Rule not applied: ${ruleName}, ${e}`);
            }
        }

        return { categories: results, rule: "One of the rules" };
    }
}