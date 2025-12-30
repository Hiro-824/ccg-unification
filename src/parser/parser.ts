export interface Grammar<T> {
    getTerminalCategories(word: string): T[];
    combine(left: T, right: T): T[];
}

export function parse<T>(words: string[], grammar: Grammar<T>): T[] {
    const length = words.length;
    if (length < 1) return [];
    const chart: T[][][] = Array.from({ length: length }, () =>
        Array.from({ length: length }, () => [])
    );
    for (let i = 0; i <= length - 1; i++) {
        chart[0][i] = grammar.getTerminalCategories(words[i]);
    }
    for (let spanLength = 2; spanLength <= length; spanLength++) {
        for (let start = 0; start <= length - spanLength; start++) {
            const end = start + spanLength - 1;
            for (let split = start + 1; split <= end; split++) {
                const leftCategories = chart[split - start - 1][start];
                const rightCategories = chart[end - split][split];
                for (const leftCategory of leftCategories) {
                    for (const rightCategory of rightCategories) {
                        const results = grammar.combine(leftCategory, rightCategory);
                        if (results.length > 0) {
                            chart[spanLength - 1][start].push(...results);
                        }
                    }
                }
            }
        }
    }

    return chart[length - 1][0];
}

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

const grammar = new ContextFreeGrammar();
const sentence = ["a", "dog", "sees", "dog"];

const result = parse(sentence, grammar);
console.log(result);