import { Grammar } from "../../core/parser";

export class CFG implements Grammar<string> {

    lexicon: Map<string, string> = new Map();

    constructor() {
        this.lexicon.set("john", "NP");
        this.lexicon.set("mary", "NP");
        this.lexicon.set("sees", "V");
        this.lexicon.set("girl", "N");
        this.lexicon.set("telescope", "N");
        this.lexicon.set("a", "Det");
        this.lexicon.set("with", "P");
    }

    getAvailableWords(): string[] {
        return [...this.lexicon.keys()];
    }

    getTerminalCategories(word: string): string[] {
        const category = this.lexicon.get(word);
        return category ? [category] : [];
    }

    combine(left: string, right: string): { category: string; rule: string }[] {
        if (left === "NP" && right === "VP") return [{ category: "S", rule: "S → NP VP" }];
        if (left === "V" && right === "NP") return [{ category: "VP", rule: "VP → V NP" }];
        if (left === "Det" && right === "N") return [{ category: "NP", rule: "NP → Det N" }];
        if (left === "P" && right === "NP") return [{ category: "PP", rule: "PP → P NP" }];
        if (left === "VP" && right === "PP") return [{ category: "VP", rule: "VP → VP PP" }];
        if (left === "N" && right === "PP") return [{ category: "N", rule: "N → N PP" }];
        return [];
    }
}
