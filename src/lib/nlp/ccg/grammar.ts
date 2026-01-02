import { Grammar } from "../core/parser"
import { Category, ComplexCategory } from "./types";

export interface Unifier<P, Env> {
    createEmptyEnv(): Env;
    unify(a: P, b: P, prev: Env): Env | null;
    apply(a: P, env: Env): P;
    refresh(a: P): P;
}

export class CCG<P, Env> implements Grammar<Category<P>> {

    constructor(
        private lexicon: Record<string, Category<P>[]>,
        private unifier: Unifier<P, Env>,
    ) { }

    getTerminalCategories(word: string): Category<P>[] {
        const categories = this.lexicon[word] || [];
        return categories.map(cat => this.refreshCategory(cat));
    }

    combine(left: Category<P>, right: Category<P>): Category<P>[] {
        const results: Category<P>[] = [];

        // Forward Application ( > )
        const forwardResult = this.applyForward(left, right);
        if (forwardResult) results.push(forwardResult);

        // Backward Application ( < )
        const backwardResult = this.applyBackward(left, right);
        if (backwardResult) results.push(backwardResult);

        // Forward Composition ( B> )
        const forwardCompositionResult = this.composeForward(left, right);
        if (forwardCompositionResult) results.push(forwardCompositionResult);

        // Backward Composition ( B< )
        const backwardCompositionResult = this.composeBackward(left, right);
        if (backwardCompositionResult) results.push(backwardCompositionResult);

        return results;
    }

    private applyForward(left: Category<P>, right: Category<P>): Category<P> | null {
        const env = this.unifier.createEmptyEnv();
        if (!this.isComplex(left) || left.direction !== "/") return null;
        const resultEnv = this.unifyCategory(left.argument, right, env);
        if (resultEnv !== null) return this.applyEnv(left.result, env);
        return null;
    }

    private applyBackward(left: Category<P>, right: Category<P>): Category<P> | null {
        const env = this.unifier.createEmptyEnv();
        if (!this.isComplex(right) || right.direction !== "\\") return null;
        const resultEnv = this.unifyCategory(left, right.argument, env);
        if (resultEnv !== null) return this.applyEnv(right.result, env);
        return null;
    }

    private composeForward(left: Category<P>, right: Category<P>): Category<P> | null {
        if (!this.isComplex(left) || left.direction !== "/") return null;
        if (!this.isComplex(right) || right.direction !== "/") return null;

        const env = this.unifier.createEmptyEnv();
        const resultEnv = this.unifyCategory(left.argument, right.result, env);

        if (resultEnv !== null) {
            return {
                kind: "ComplexCategory",
                direction: "/",
                result: this.applyEnv(left.result, resultEnv),
                argument: this.applyEnv(right.argument, resultEnv)
            };
        }
        return null;
    }

    private composeBackward(left: Category<P>, right: Category<P>): Category<P> | null {
        if (!this.isComplex(left) || left.direction !== "\\") return null;
        if (!this.isComplex(right) || right.direction !== "\\") return null;

        const env = this.unifier.createEmptyEnv();
        const resultEnv = this.unifyCategory(left.result, right.argument, env);

        if (resultEnv !== null) {
            return {
                kind: "ComplexCategory",
                direction: "\\",
                result: this.applyEnv(right.result, resultEnv),
                argument: this.applyEnv(left.argument, resultEnv)
            };
        }
        return null;
    }

    private unifyCategory(a: Category<P>, b: Category<P>, env: Env): Env | null {
        if (a.kind === "AtomicCategory" && b.kind === "AtomicCategory") {
            return this.unifier.unify(a.payload, b.payload, env);
        }
        if (a.kind === "ComplexCategory" && b.kind === "ComplexCategory" && a.direction === b.direction) {
            const argumentEnv = this.unifyCategory(a.argument, b.argument, env);
            if (argumentEnv === null) return null;
            return this.unifyCategory(a.result, b.result, argumentEnv);
        }
        return null;
    }

    private applyEnv(a: Category<P>, env: Env): Category<P> {
        if (a.kind === "AtomicCategory") {
            return {
                kind: "AtomicCategory",
                payload: this.unifier.apply(a.payload, env)
            };
        } else {
            return {
                kind: "ComplexCategory",
                direction: a.direction,
                result: this.applyEnv(a.result, env),
                argument: this.applyEnv(a.argument, env)
            }
        }
    }

    private isComplex(c: Category<P>): c is ComplexCategory<P> {
        return c.kind === "ComplexCategory";
    }

    private refreshCategory(category: Category<P>): Category<P> {
        if (category.kind === "ComplexCategory") {
            return {
                kind: "ComplexCategory",
                direction: category.direction,
                argument: this.refreshCategory(category.argument),
                result: this.refreshCategory(category.result)
            };
        } else {
            return {
                kind: "AtomicCategory",
                payload: this.unifier.refresh(category.payload)
            };
        }
    }
}