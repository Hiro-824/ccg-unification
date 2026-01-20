type Attribute = string;
type AtomicValue = string;

class FeatureStructure {

    private _isAtomic: boolean = false;
    private _atomicValue: AtomicValue | null = null;
    private _features: Map<Attribute, FeatureStructure> = new Map();
    
    constructor(value?: AtomicValue) {
        if(value) {
            this._isAtomic = true;
            this._atomicValue = value;
        }
    }

    isAtomic(): boolean {
        return this._isAtomic;
    }

    getValue(): AtomicValue {
        if(!this._isAtomic) {
            throw new Error("You cannot get an atomic value from a complex feature structure.");
        }
        return this._atomicValue!;
    }

    get(attribute: Attribute): FeatureStructure | undefined {
        if(this._isAtomic) {
            throw new Error("You cannot get an atomic value from a complex feature structure.");
        }
        return this._features.get(attribute);
    }

    add(attribute: Attribute, value: FeatureStructure) {
        if(this._isAtomic) {
            throw new Error("You cannot set a feature in an atomic feature structure.");
        }
        this._features.set(attribute, value);
    }

    getAttributes(): IterableIterator<Attribute> {
        if(this._isAtomic) {
            return [].values();
        }
        return this._features.keys();
    }

    getIn(path: Attribute[]): FeatureStructure | undefined {
        if (path.length === 0) return this;
        if (this._isAtomic) return undefined;
    
        const head = path[0];
        const child = this._features.get(head);
    
        if (!child) return undefined;
        return child.getIn(path.slice(1));
    }
    
    toString(): string {
        if(this._isAtomic) {
            return this._atomicValue!;
        }
        const entries = Array.from(this._features.entries()).map(([attr, fs]) => `${attr}: ${fs.toString()}`);
        return `[ ${entries.join(", ")} ]`;
    }
}

export function unify(fs1: FeatureStructure, fs2: FeatureStructure): FeatureStructure | null {
    if(fs1.isAtomic() && fs2.isAtomic()) {
        const value1 = fs1.getValue()!;
        const value2 = fs2.getValue()!;
        if(value1 === value2) {
            return new FeatureStructure(value1);
        } else {
            return null;
        }
    }

    if(fs1.isAtomic() !== fs2.isAtomic()) {
        return null;
    }

    const result = new FeatureStructure();

    const allAttributes = new Set<string>();
    for (const k of fs1.getAttributes()) allAttributes.add(k);
    for (const k of fs2.getAttributes()) allAttributes.add(k);

    for (const k of allAttributes) {
        const value1 = fs1.get(k);
        const value2 = fs2.get(k);
        if(value1 === undefined && value2 !== undefined) result.add(k, value2);
        if(value2 === undefined && value1 !== undefined) result.add(k, value1);
        if(value1 !== undefined && value2 !== undefined) {
            const recursiveResult = unify(value1, value2);
            if(recursiveResult === null) return null;
            result.add(k, recursiveResult);
        }
    }

    return result;
}