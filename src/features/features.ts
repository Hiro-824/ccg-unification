export type Attribute = string;
export type AtomicValue = string;

export class FeatureStructure {
    private _atomicValue: AtomicValue | null = null;
    private _features: Map<Attribute, FeatureStructure> = new Map();
    private _isAtomic: boolean = false;

    constructor(value?: AtomicValue) {
        if (value) {
            this._atomicValue = value;
            this._isAtomic = true;
        }
    }

    isAtomic(): boolean {
        return this._isAtomic;
    }

    getValue(): AtomicValue | null {
        return this._atomicValue;
    }

    getAttributes(): IterableIterator<Attribute> {
        if (this._isAtomic) {
            return [].values(); // Return empty iterator for atoms
        }
        return this._features.keys();
    }

    add(attribute: Attribute, value: FeatureStructure): void {
        if (this._isAtomic) {
            throw new Error(`Invalid Operation: Cannot add feature '${attribute}' to an atomic node ('${this._atomicValue}').`);
        }
        this._features.set(attribute, value);
    }

    get(attribute: Attribute): FeatureStructure | undefined {
        if (this._isAtomic) {
            throw new Error(`Invalid Operation: Cannot retrieve feature '${attribute}' from an atomic node.`);
        }
        return this._features.get(attribute);
    }

    toString(): string {
        if (this._isAtomic) {
            return this._atomicValue!;
        }

        const entries = Array.from(this._features.entries())
            .map(([attr, fs]) => `${attr}: ${fs.toString()}`);

        return `[ ${entries.join(", ")} ]`;
    }
}

export function unify(fs1: FeatureStructure, fs2: FeatureStructure): FeatureStructure | null {

    // Case 1: Both Atomic
    if (fs1.isAtomic() && fs2.isAtomic()) {
        const val1 = fs1.getValue();
        const val2 = fs2.getValue();
        return val1 === val2 ? new FeatureStructure(val1!) : null;
    }

    // Case 2: Mismatch (One Atomic, One Complex)
    if (fs1.isAtomic() !== fs2.isAtomic()) {
        return null;
    }

    // Case 3: Both Complex
    // We are now safe to assume both are complex
    const unified = new FeatureStructure();

    // 1. Create a Set of all unique attributes from both structures
    const allAttributes = new Set<string>();
    for (const k of fs1.getAttributes()) allAttributes.add(k);
    for (const k of fs2.getAttributes()) allAttributes.add(k);

    // 2. Iterate over every attribute
    for (const key of allAttributes) {
        const val1 = fs1.get(key);
        const val2 = fs2.get(key);

        let mergedValue: FeatureStructure | null = null;

        if (val1 && !val2) {
            // Only in FS1: copy it
            // (Note: In a deeper implementation, we might clone this to ensure immutability)
            mergedValue = val1;
        } else if (!val1 && val2) {
            // Only in FS2: copy it
            mergedValue = val2;
        } else if (val1 && val2) {
            // In both: RECURSION
            mergedValue = unify(val1, val2);
            if (mergedValue === null) return null;
        }

        // Add the successful result to our new structure
        if (mergedValue) {
            unified.add(key, mergedValue);
        }
    }

    return unified;
}