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