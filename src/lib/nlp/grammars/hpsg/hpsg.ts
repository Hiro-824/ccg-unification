import { Grammar } from "../../core/parser";
import { FeatureStructure, FeatureStructureInput } from "../../features/features";
import { TypeSystem } from "../../features/types";
import { lexiconData, LexiconDefinition } from "./lexicon";
import { ruleData } from "./rules";
import { typeDefinition } from "./types";

export class HPSG implements Grammar<FeatureStructure> {

    types: TypeSystem = new TypeSystem();
    private _lexicon: Map<string, FeatureStructure[]> = new Map();
    private _rules: Map<string, FeatureStructure> = new Map();

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
        this.types.loadDefinition(typeDefinition);
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

    combine(left: FeatureStructure, right: FeatureStructure): { category: FeatureStructure; rule: string }[] {
        const results: { category: FeatureStructure; rule: string }[] = [];

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
                results.push({ category: targetMother, rule: ruleName });
            } catch (e) {
                console.log(`Rule not applied: ${ruleName}, ${e}`);
            }
        }

        return results;
    }
}
