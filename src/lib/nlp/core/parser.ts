export interface Grammar<T> {
    getTerminalCategories(word: string): T[];
    combine(left: T, right: T): T[];
}

type Node<T> = {
    mother: T;
    left?: Node<T>;
    right?: Node<T>;
}

export function parse<T>(words: string[], grammar: Grammar<T>): Node<T>[] {
    const length = words.length;
    if (length < 1) return [];
    const chart: Node<T>[][][] = Array.from({ length: length }, () =>
        Array.from({ length: length }, () => [])
    );
    for (let i = 0; i <= length - 1; i++) {
        const categories = grammar.getTerminalCategories(words[i]);
        const nodes: Node<T>[] = [];
        categories.forEach((cat) => { nodes.push({ mother: cat }) })
        chart[0][i] = nodes;
    }
    for (let spanLength = 2; spanLength <= length; spanLength++) {
        for (let start = 0; start <= length - spanLength; start++) {
            const end = start + spanLength - 1;
            for (let split = start + 1; split <= end; split++) {
                const leftCategories = chart[split - start - 1][start];
                const rightCategories = chart[end - split][split];
                for (const leftCategory of leftCategories) {
                    for (const rightCategory of rightCategories) {
                        const results = grammar.combine(leftCategory.mother, rightCategory.mother);
                        const resultNodes: Node<T>[] = [];
                        results.forEach((cat) => { resultNodes.push({mother: cat, left: leftCategory, right: rightCategory})})
                        if (results.length > 0) {
                            chart[spanLength - 1][start].push(...resultNodes);
                        }
                    }
                }
            }
        }
    }

    return chart[length - 1][0];
}