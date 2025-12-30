import { Grammar } from "./parser";

type Category = string;

class ContextFreeGrammar implements Grammar<Category> {
    words: Record<string, Category[]> = {
        "John": ["NP"],
        "sees": ["V"],
        "Mary": ["NP"],
        "a": ["Det"],
        "dog": ["N"]
    };

    rulesMap: Record<string, Category[]> = {
        "NP VP": ["S"],
        "V NP":  ["VP"],
        "Det N": ["NP"]
    };

    getTerminalCategories(word: string): Category[] {
        const categories = this.words[word];
        return categories||[];
    }

    combine(left: Category, right: Category): Category[] {
        const key = `${left} ${right}`;
        return this.rulesMap[key] || [];
    }
}

export const contextFreeGrammar = new ContextFreeGrammar();