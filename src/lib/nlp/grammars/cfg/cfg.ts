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
    
    combine(left: string, right: string): string[] {
        if(left === "NP" && right === "VP") return ["S"];
        if(left === "V" && right === "NP") return ["VP"];
        if(left === "Det" && right === "N") return ["NP"];
        if(left === "P" && right === "NP") return ["PP"];
        if(left === "VP" && right === "PP") return ["VP"];
        if(left === "N" && right === "PP") return ["N"];
        return [];
    }
}