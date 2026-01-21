type Attribute = string;
type AtomicValue = string;

class FeatureStructure {

    private _type: TypeName = "top";
    private _isAtomic: boolean = false;
    private _atomicValue: AtomicValue | null = null;
    private _features: Map<Attribute, FeatureStructure> = new Map();
    _forward: FeatureStructure | null = null;
    
    constructor(type: TypeName, value?: AtomicValue) {
        this._type = type;
        if(value) {
            this._isAtomic = true;
            this._atomicValue = value;
        }
    }

    dereference(): FeatureStructure {
        if(this._forward === null) return this;
        const result = this._forward.dereference();
        this._forward = result;
        return result;
    }

    isAtomic(): boolean {
        const realNode = this.dereference();
        if(realNode !== this) return realNode.isAtomic();
        return this._isAtomic;
    }

    getType(): TypeName {
        const realNode = this.dereference();
        if(realNode !== this) return realNode.getType();
        return this._type;
    }

    setType(type: TypeName) {
        const realNode = this.dereference();
        if(realNode !== this) {
            realNode.setType(type);
            return;
        }
        this._type = type;
    }

    getValue(): AtomicValue {
        const realNode = this.dereference();
        if(realNode !== this) return realNode.getValue();
        if(!this._isAtomic) {
            throw new Error("You cannot get an atomic value from a complex feature structure.");
        }
        return this._atomicValue!;
    }

    get(attribute: Attribute): FeatureStructure | undefined {
        const realNode = this.dereference();
        if(realNode !== this) return realNode.get(attribute);
        if(this._isAtomic) {
            throw new Error("You cannot get an atomic value from a complex feature structure.");
        }
        return this._features.get(attribute);
    }

    add(attribute: Attribute, value: FeatureStructure) {
        const realNode = this.dereference();
        if(realNode !== this) {
            realNode.add(attribute, value);
            return;
        }
        
        if(this._isAtomic) {
            throw new Error("You cannot set a feature in an atomic feature structure.");
        }
        this._features.set(attribute, value);
    }

    getAttributes(): IterableIterator<Attribute> {
        const realNode = this.dereference();
        if(realNode !== this) return realNode.getAttributes();
        if(this._isAtomic) {
            return [].values();
        }
        return this._features.keys();
    }

    getIn(path: Attribute[]): FeatureStructure | undefined {
        
        const realNode = this.dereference();
        if(realNode !== this) return realNode.getIn(path);

        if (path.length === 0) return this;
        if (this._isAtomic) return undefined;
    
        const head = path[0];
        const child = this._features.get(head);
    
        if (!child) return undefined;
        return child.getIn(path.slice(1));
    }
    
    toString(): string {
        const realNode = this.dereference();
        if(realNode !== this) return realNode.toString();
        if(this._isAtomic) {
            return this._atomicValue!;
        }
        const entries = Array.from(this._features.entries()).map(([attr, fs]) => `${attr}: ${fs.toString()}`);
        return `${this._type}[ ${entries.join(", ")} ]`;
    }

    // 内部のToken Identityを保ったままコピーを作る
    deepCopy(memo: Map<FeatureStructure, FeatureStructure> = new Map()): FeatureStructure {
        const realSource = this.dereference();
        if (memo.has(realSource)) {
            return memo.get(realSource)!;
        }
        const copy = new FeatureStructure(realSource._type, realSource._atomicValue ?? undefined);
        memo.set(realSource, copy);
        if (!realSource._isAtomic) {
            for (const [attr, child] of realSource._features) {
                copy.add(attr, child.deepCopy(memo));
            }
        }
        return copy;
    }
    
}

export function unify(fs1: FeatureStructure, fs2: FeatureStructure, types: TypeSystem): void {
    const n1 = fs1.dereference();
    const n2 = fs2.dereference();

    if (n1 === n2) return;

    const newType = types.unifyTypes(n1.getType(), n2.getType());
    if (newType === null) throw new Error("Unification Failed");

    if (n1.isAtomic() && n2.isAtomic()) {
        if (n1.getValue() !== n2.getValue()) {
            throw new Error(`Atomic Clash: ${n1.getValue()} vs ${n2.getValue()}`);
        }
    }

    else if (n1.isAtomic() !== n2.isAtomic()) {
        throw new Error("Structure Clash: Atom vs Complex");
    }

    const featuresToMerge: Array<[Attribute, FeatureStructure]> = [];
    for (const key of n1.getAttributes()) {
        featuresToMerge.push([key, n1.get(key)!]);
    }

    n2.setType(newType);
    n1._forward = n2; 
    
    for (const [key, val1] of featuresToMerge) {
        const val2 = n2.get(key);

        if (val2) {
            unify(val1, val2, types);
        } else {
            n2.add(key, val1);
        }
    }
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

// --- 1. SETUP TYPE SYSTEM ---
const types = new TypeSystem();
types.addType("word", "top");
types.addType("noun", "word");
types.addType("verb", "word");
types.addType("string", "top"); // A type for our atoms

// --- 2. HELPERS ---
// Creates a complex structure with a specific type
const mkComplex = (t: string) => new FeatureStructure(t);

// Creates an atomic structure (Type: string, Value: v)
const mkAtom = (v: string) => new FeatureStructure("string", v);

console.log("=== TEST 1: The Chain (Transitivity) ===");
const A = mkComplex("top");
const B = mkComplex("top");
const C = mkComplex("noun");

// Unify A and B -> A points to B
unify(A, B, types);
// Unify B and C -> B points to C
unify(B, C, types);

// Now, A should effectively be C
console.log("A is now noun?", A.getType() === "noun"); 
console.log("A points to C?", A.dereference() === C);
console.log("B points to C?", B.dereference() === C);


console.log("\n=== TEST 2: The Parser Simulation (Safe Copying) ===");

// 1. Construct the Lexicon Entry: [ word, AGR: [ string, NUM: "sg" ] ]
const lexiconEntry = mkComplex("word");
const agrT = mkComplex("top"); 
agrT.add("NUM", mkAtom("sg"));
lexiconEntry.add("AGR", agrT);

console.log("Lexicon Entry:", lexiconEntry.toString());

// 2. Construct the Verb Requirement: [ verb, AGR: [ string, NUM: "pl" ] ]
const verbReq = mkComplex("verb");
const agrV = mkComplex("top");
agrV.add("NUM", mkAtom("pl")); 
verbReq.add("AGR", agrV);

console.log("Verb Req:", verbReq.toString());

// 3. Prepare for Unification
// We must COPY first, because if unify fails, the objects are destroyed.
const cand1 = lexiconEntry.deepCopy();
const cand2 = verbReq.deepCopy();

// 4. Attempt Unification
console.log("Attempting Unify (Singular vs Plural)...");
try {
    unify(cand1, cand2, types);
    console.log("SUCCESS (Unexpected) - logic is broken if you see this.");
} catch (e) {
    console.log("FAILED (Expected):", (e as Error).message);
}

// 5. Verify Integrity of Originals
// The original lexicon entry should still represent a generic word, not a verb.
console.log("Original Lexicon Entry Type is still 'word'?", lexiconEntry.getType() === "word");

// Check deep integrity: The 'AGR' feature on the original should still be singular.
// We use getIn to drill down safely.
const origNum = lexiconEntry.getIn(["AGR", "NUM"]);

// Note: origNum is the node. We check its value.
console.log("Original Lexicon NUM is still 'sg'?", origNum?.getValue() === "sg");