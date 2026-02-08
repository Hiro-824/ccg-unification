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

    private getRestr(expr: FeatureStructure): FeatureStructure {
        const restr = expr.getIn(["SEM", "RESTR"]);
        return restr ?? new FeatureStructure("pred-list-empty");
    }

    private concatPredList(prefix: FeatureStructure, suffix: FeatureStructure): FeatureStructure {
        const p = prefix.dereference();
        const s = suffix.dereference();

        const t = p.getType();
        if (t === "pred-list-empty") return s;
        if (t !== "pred-list-cons") {
            throw new Error(`Unsupported pred-list type for concatenation: ${t}`);
        }

        const first = p.get("FIRST");
        if (!first) {
            throw new Error(`Malformed pred-list-cons: missing FIRST`);
        }

        const rest = p.get("REST");
        const newRest = rest ? this.concatPredList(rest, s) : s;

        const out = new FeatureStructure("pred-list-cons");
        out.add("FIRST", first, this.types);
        out.add("REST", newRest, this.types);
        return out;
    }

    private setMotherRestrAsSum(mother: FeatureStructure, head: FeatureStructure, nonHead: FeatureStructure): void {
        const headRestr = this.getRestr(head);
        const nonHeadRestr = this.getRestr(nonHead);
        const summed = this.concatPredList(headRestr, nonHeadRestr);

        const motherSem = mother.get("SEM");
        if (!motherSem) {
            throw new Error("Mother is missing SEM");
        }
        motherSem.add("RESTR", summed, this.types);
    }

    private ensureRelnSubtype(relnName: string): void {
        if (relnName === "reln") return;

        const hierarchy: unknown = (this.types as unknown as { _typeHierarchy?: unknown })._typeHierarchy;
        const hasType =
            hierarchy instanceof Map
                ? hierarchy.has(relnName)
                : typeof (hierarchy as { has?: unknown } | undefined)?.has === "function"
                    ? (hierarchy as { has: (k: string) => boolean }).has(relnName)
                    : false;

        if (hasType) {
            if (!this.types.isSubtype(relnName, "reln")) {
                console.warn(
                    `Type "${relnName}" already exists but is not a subtype of "reln"; skipping auto-add.`
                );
            }
            return;
        }

        this.types.addType(relnName, "reln");
    }

    private collectRelnTypesFromLexicon(definition: LexiconDefinition): Set<string> {
        const relns = new Set<string>();

        const visit = (node: unknown) => {
            if (typeof node === "string") return;
            if (Array.isArray(node)) {
                for (const item of node) visit(item);
                return;
            }
            if (node === null || typeof node !== "object") return;

            for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
                if (key === "RELN" && typeof value === "string" && !value.startsWith("#")) {
                    relns.add(value);
                    continue;
                }
                visit(value);
            }
        };

        for (const fsDefs of Object.values(definition)) {
            for (const fsDef of fsDefs) visit(fsDef);
        }

        return relns;
    }

    private linearizeList(list: FeatureStructure): FeatureStructure[] {
        const linear: FeatureStructure[] = [];
        if (!this.types.isSubtype(list.getType(), "exp-list")) {
            throw new Error(`Cannot linearize non exp-list: ${list.getType()}`);
        }

        let node = list.dereference();
        while (node.getType() === "exp-list-cons") {
            const first = node.get("FIRST");
            const rest = node.get("REST");
            if (!first || !rest) {
                throw new Error("Malformed exp-list-cons: missing FIRST and/or REST");
            }
            linear.push(first);
            node = rest.dereference();
        }

        if (node.getType() !== "exp-list-empty") {
            throw new Error(`Malformed exp-list: expected exp-list-empty, got ${node.getType()}`);
        }

        return linear;
    }

    // anaphorがあったらとりあえずどれかのantecedent候補とcoindexさせるだけなので、厳密なbinding theoryではない。
    private enforceBindingTheory(mother: FeatureStructure): void {
        const argSt = mother.get("ARG-ST");
        if (!argSt) {
            throw new Error("Mother is missing ARG-ST.");
        }

        const args = this.linearizeList(argSt);
        const agrLeafTypes = new Set(["1sing", "2sing", "3sing", "plural"]);

        const getOrCreateIndex = (expr: FeatureStructure): FeatureStructure => {
            const sem = expr.get("SEM");
            if (!sem) {
                throw new Error("Expression is missing SEM.");
            }
            const existing = sem.get("INDEX");
            if (existing) return existing;

            const created = new FeatureStructure("index");
            sem.add("INDEX", created, this.types);
            return created;
        };

        const canUnify = (a: FeatureStructure, b: FeatureStructure): boolean => {
            const aCopy = a.deepCopy(new Map(), this.types);
            const bCopy = b.deepCopy(new Map(), this.types);
            try {
                FeatureStructure.unify(aCopy, bCopy, this.types);
                return true;
            } catch {
                return false;
            }
        };

        for (let i = 0; i < args.length; i++) {
            const ana = args[i];

            const mode = ana.getIn(["SEM", "MODE"]);
            if (!mode) continue;
            if (mode.dereference().getType() !== "ana") continue;

            const anaAgr = ana.getIn(["SYN", "HEAD", "AGR"]);
            if (!anaAgr) {
                throw new Error("An anaphor is missing SYN.HEAD.AGR.");
            }
            const anaAgrType = anaAgr.dereference().getType();
            if (!agrLeafTypes.has(anaAgrType)) {
                throw new Error(`An anaphor has underspecified AGR: ${anaAgrType}`);
            }

            const anaIndex = getOrCreateIndex(ana);

            let antecedent: FeatureStructure | undefined;
            for (let j = i - 1; j >= 0; j--) {
                const ant = args[j];
                const antAgr = ant.getIn(["SYN", "HEAD", "AGR"]);
                if (!antAgr) continue;
                if (!canUnify(anaAgr, antAgr)) continue;

                const antIndex = getOrCreateIndex(ant);

                antecedent = ant;

                FeatureStructure.unify(anaAgr, antAgr, this.types);
                FeatureStructure.unify(anaIndex, antIndex, this.types);
                break;
            }

            if (!antecedent) {
                throw new Error(`No antecedent for anaphor in ARG-ST (AGR=${anaAgrType}).`);
            }
        }
    }

    loadLexicon(definition: LexiconDefinition): void {
        for (const relnName of this.collectRelnTypesFromLexicon(definition)) {
            this.ensureRelnSubtype(relnName);
        }

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
                this.setMotherRestrAsSum(targetMother, candidateHead, candidateNonHead);
                this.enforceBindingTheory(targetMother);
                console.log(`Rule applied: ${ruleName}`);
                results.push({ category: targetMother, rule: ruleName });
            } catch (e) {
                console.log(`Rule not applied: ${ruleName}, ${e}`);
            }
        }

        return results;
    }
}
