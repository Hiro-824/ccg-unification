type Attribute = string;

export class FeatureStructure {

    private _type: TypeName = "top";
    private _features: Map<Attribute, FeatureStructure> = new Map();
    _forward: FeatureStructure | null = null;

    constructor(type: TypeName) {
        this._type = type;
    }

    dereference(): FeatureStructure {
        if (this._forward === null) return this;
        const result = this._forward.dereference();
        this._forward = result;
        return result;
    }

    getType(): TypeName {
        const realNode = this.dereference();
        if (realNode !== this) return realNode.getType();
        return this._type;
    }

    setType(type: TypeName) {
        const realNode = this.dereference();
        if (realNode !== this) {
            realNode.setType(type);
            return;
        }
        this._type = type;
    }

    get(attribute: Attribute): FeatureStructure | undefined {
        const realNode = this.dereference();
        if (realNode !== this) return realNode.get(attribute);
        return this._features.get(attribute);
    }

    add(attribute: Attribute, value: FeatureStructure, types: TypeSystem) {
        const realNode = this.dereference();
        if (realNode !== this) {
            realNode.add(attribute, value, types);
            return;
        }

        const appropriateType = types.getAppropriateType(this._type, attribute);
        if (appropriateType === null) {
            throw new Error(`The feature ${attribute} does not exist on ${this._type}.`);
        }
        if (types.unifyTypes(appropriateType, value.getType()) === null) {
            throw new Error(`The value type ${value.getType()} is not compatible with ${appropriateType}.`);
        }

        const existing = this._features.get(attribute);
        if (existing) {
            FeatureStructure.unify(existing, value, types);
        } else {
            this._features.set(attribute, value);
        }
    }

    getAttributes(): IterableIterator<Attribute> {
        const realNode = this.dereference();
        if (realNode !== this) return realNode.getAttributes();
        return this._features.keys();
    }

    getIn(path: Attribute[]): FeatureStructure | undefined {

        const realNode = this.dereference();
        if (realNode !== this) return realNode.getIn(path);

        if (path.length === 0) return this;

        const head = path[0];
        const child = this._features.get(head);

        if (!child) return undefined;
        return child.getIn(path.slice(1));
    }

    toString(visited: Map<FeatureStructure, number> = new Map()): string {
        const realNode = this.dereference();
        if (realNode !== this) return realNode.toString(visited);
        if (visited.has(realNode)) return `<${visited.get(realNode)}>`;
        visited.set(realNode, visited.size + 1);
        const entries = Array.from(this._features.entries())
            .map(([attr, fs]) => `${attr}: ${fs.toString(visited)}`);
        return `${this._type}[ ${entries.join(", ")} ]`;
    }

    // 内部のToken Identityを保ったままコピーを作る
    deepCopy(memo: Map<FeatureStructure, FeatureStructure> = new Map(), types: TypeSystem): FeatureStructure {
        const realSource = this.dereference();
        if (memo.has(realSource)) {
            return memo.get(realSource)!;
        }
        const copy = new FeatureStructure(realSource._type);
        memo.set(realSource, copy);
        for (const [attr, child] of realSource._features) {
            copy.add(attr, child.deepCopy(memo, types), types);
        }
        return copy;
    }

    static unify(fs1: FeatureStructure, fs2: FeatureStructure, types: TypeSystem): void {
        const n1 = fs1.dereference();
        const n2 = fs2.dereference();
    
        if (n1 === n2) return;
    
        const newType = types.unifyTypes(n1.getType(), n2.getType());
        if (newType === null) throw new Error("Unification Failed");
    
        const featuresToMerge: Array<[Attribute, FeatureStructure]> = [];
        for (const key of n1.getAttributes()) {
            featuresToMerge.push([key, n1.get(key)!]);
        }
    
        n2.setType(newType);
        n1._forward = n2;
    
        for (const [key, val1] of featuresToMerge) {
            const val2 = n2.get(key);
    
            if (val2) {
                FeatureStructure.unify(val1, val2, types);
            } else {
                n2.add(key, val1, types);
            }
        }
    }
} 

type TypeName = string;

export class TypeSystem {
    private _typeHierarchy: Map<TypeName, TypeName> = new Map();
    private _appropriateness: Map<TypeName, Map<Attribute, TypeName>> = new Map();
    // TypeName(1)という型のFeatureStructureインスタンスは、
    // 素性名がAttributeで素性値がTypeName(2)であるような素性を持つことができ、
    // それ以外の素性を持つことはできない

    constructor() {
        this._typeHierarchy.set("top", "top");
        this._appropriateness.set("top", new Map());
    }

    addType(type: TypeName, parentType: TypeName) {
        this._typeHierarchy.set(type, parentType);
        this._appropriateness.set(type, new Map());
    }

    addFeature(type: TypeName, attribute: Attribute, range: TypeName): void {
        const features = this._appropriateness.get(type);
        if (!features) {
            throw new Error(`Cannot add feature to unknown type: ${type}`);
        }
        features.set(attribute, range);
    }

    // typeという型のattributeという素性(素性名がattributeである素性)の素性値には、どんな型のものがなれる？
    getAppropriateType(type: TypeName, attribute: Attribute): TypeName | null {
        let current: TypeName | undefined = type;
        while (current) {
            const features = this._appropriateness.get(current);
            if (features && features.has(attribute)) {
                return features.get(attribute)!;
            }
            if (current === "top") break;
            current = this._typeHierarchy.get(current);
        }
        return null;
    }

    isSubtype(subtype: TypeName, parentType: TypeName): boolean {
        if (subtype === parentType) return true;
        if (parentType === "top") return true;
        let current: TypeName | undefined = subtype;
        const visited: Set<TypeName> = new Set();

        while (current && current !== "top") {
            if (visited.has(current)) return false;
            visited.add(current);

            const nextParent = this._typeHierarchy.get(current);
            if (nextParent === parentType) return true;

            current = nextParent;
        }
        return false;
    }

    unifyTypes(type1: TypeName, type2: TypeName): TypeName | null {
        if (type1 === type2) return type1;
        if (this.isSubtype(type1, type2)) return type1;
        if (this.isSubtype(type2, type1)) return type2;
        return null
    }
}