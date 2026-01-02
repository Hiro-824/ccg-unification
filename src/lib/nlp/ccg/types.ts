export type Category<P> = AtomicCategory<P> | ComplexCategory<P>
export type AtomicCategory<P> = {
    kind: "AtomicCategory"
    payload: P
}
export type ComplexCategory<P> = {
    kind: "ComplexCategory",
    direction: "/" | "\\",
    result: Category<P>,
    argument: Category<P>
}