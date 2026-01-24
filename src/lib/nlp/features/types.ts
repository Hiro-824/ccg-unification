import { Attribute } from "./features";

export type TypeName = string;

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

    loadDefinition(json: Record<string, { parent: TypeName, features?: Record<Attribute, TypeName> }>): void {
        const typeNames = Object.keys(json);

        // Pass 1: まず全ての型を階層に登録する
        // (親型が未登録だとエラーになる可能性があるため、理想的にはトポロジカルソートが必要だが
        //  ここでは単純に2パス処理とし、addTypeの実装が順序に依存しないことを前提とするか、
        //  ユーザーが親から順に定義することを期待する)
        // ※前回のaddType実装はMapへのsetだけなので順序不同でもエラーにはなりませんが、
        //   isSubtype等を呼ぶ前には全登録が必要です。
        for (const typeName of typeNames) {
            if (typeName === "top") continue;
            const def = json[typeName];
            this.addType(typeName, def.parent);
        }

        for (const typeName of typeNames) {
            const def = json[typeName];
            if (def.features) {
                for (const [attr, rangeType] of Object.entries(def.features)) {
                    this.addFeature(typeName, attr, rangeType);
                }
            }
        }
    }
}