type Attribute = string;
type AtomicValue = string;

class FeatureStructure {

    private _type: TypeName = "top";
    private _isAtomic: boolean = false;
    private _atomicValue: AtomicValue | null = null;
    private _features: Map<Attribute, FeatureStructure> = new Map();
    
    constructor(type: TypeName, value?: AtomicValue) {
        this._type = type;
        if(value) {
            this._isAtomic = true;
            this._atomicValue = value;
        }
    }

    isAtomic(): boolean {
        return this._isAtomic;
    }

    getType(): TypeName {
        return this._type;
    }

    setType(type: TypeName) {
        this._type = type;
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
        return `${this._type}[ ${entries.join(", ")} ]`;
    }
}

export function unify(fs1: FeatureStructure, fs2: FeatureStructure, typeSystem: TypeSystem): FeatureStructure | null {

    const type1 = fs1.getType();
    const type2 = fs2.getType();
    const unifiedType = typeSystem.unifyTypes(type1, type2);
    if(unifiedType === null) return null;

    if(fs1.isAtomic() && fs2.isAtomic()) {
        const value1 = fs1.getValue()!;
        const value2 = fs2.getValue()!;
        if(value1 === value2) {
            return new FeatureStructure(unifiedType, value1);
        } else {
            return null;
        }
    }

    if(fs1.isAtomic() !== fs2.isAtomic()) {
        return null;
    }

    const result = new FeatureStructure(unifiedType);

    const allAttributes = new Set<string>();
    for (const k of fs1.getAttributes()) allAttributes.add(k);
    for (const k of fs2.getAttributes()) allAttributes.add(k);

    for (const k of allAttributes) {
        const value1 = fs1.get(k);
        const value2 = fs2.get(k);
        if(value1 === undefined && value2 !== undefined) result.add(k, value2);
        if(value2 === undefined && value1 !== undefined) result.add(k, value1);
        if(value1 !== undefined && value2 !== undefined) {
            const recursiveResult = unify(value1, value2, typeSystem);
            if(recursiveResult === null) return null;
            result.add(k, recursiveResult);
        }
    }

    return result;
}

type TypeName = string;

class TypeSystem {
    private _typeHierarchy: Map<TypeName, TypeName> = new Map();

    constructor() {
        this._typeHierarchy.set("top", "top");
    }

    addType(type: TypeName, parentType: TypeName) {
        this._typeHierarchy.set(type, parentType);
    }

    isSubtype(subtype: TypeName, parentType: TypeName): boolean {
        if(subtype === parentType) return true;
        if(parentType === "top") return true;
        let current = subtype;
        while(current !== "top") {
            const nextParent = this._typeHierarchy.get(current);
            if (!nextParent) return false; 
            if (nextParent === parentType) return true;
            current = nextParent;
            if (current === subtype) return false; 
        }
        return false;
    }

    unifyTypes(type1: TypeName, type2: TypeName): TypeName | null {
        if(type1 === type2) return type1;
        if(this.isSubtype(type1, type2)) return type1;
        if(this.isSubtype(type2, type1)) return type2;
        return null
    }
}

const typeSystem = new TypeSystem();
typeSystem.addType("word", "top");
typeSystem.addType("noun", "word");
typeSystem.addType("verb", "word");

const word = new FeatureStructure("word");
const noun = new FeatureStructure("noun");
const verb = new FeatureStructure("verb");
console.log(word.toString());
console.log(noun.toString());
console.log(verb.toString());

const result = unify(word, noun, typeSystem);
console.log(result?.toString());

const result2 = unify(verb, noun, typeSystem);
console.log(result2?.toString());