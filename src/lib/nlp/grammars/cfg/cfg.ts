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

    combine(left: string, right: string): { categories: string[], rule: string } | null {
        if (left === "NP" && right === "VP") return { categories: ["S"], rule: "S → NP VP"};
        if (left === "V" && right === "NP") return { categories: ["VP"], rule: "VP → V NP"};
        if (left === "Det" && right === "N") return { categories: ["NP"], rule: "NP → Det N"};
        if (left === "P" && right === "NP") return { categories: ["PP"], rule: "PP → P NP"};
        if (left === "VP" && right === "PP") return { categories: ["VP"], rule: "VP → VP PP"};
        if (left === "N" && right === "PP") return { categories: ["N"], rule: "N → N PP"};
        return null
    }
}