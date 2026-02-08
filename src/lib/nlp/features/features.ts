import { TypeName, TypeSystem } from "./types";

export type Attribute = string;

export type FeatureStructureInput = string | FeatureStructureAVM;
export interface FeatureStructureAVM {
    type: string;
    _id?: string;
    [key: string]: unknown;
}

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

    static fromJSON(
        json: unknown,
        types: TypeSystem,
        context: Map<string, FeatureStructure> = new Map()
    ): FeatureStructure {

        // ケース1: 文字列の場合
        if (typeof json === "string") {
            if (json.startsWith("#")) {
                const id = json.substring(1);
                const ref = context.get(id);
                if (!ref) {
                    throw new Error(`Unresolved reference: ${json}. Ensure definition (_id) comes before reference.`);
                }
                return ref;
            }
            return new FeatureStructure(json);
        }

        // ケース2: オブジェクトの場合
        // ヘルパー関数で型を絞り込む
        if (this.isAVM(json)) {
            const type = json.type;
            const fs = new FeatureStructure(type);

            // _id の処理 (数値の場合も文字列化して扱う)
            if (json._id !== undefined && json._id !== null) {
                context.set(json._id.toString(), fs);
            }

            // 各素性の処理
            for (const key of Object.keys(json)) {
                if (key === "type" || key === "_id") continue;

                const valueJSON = json[key];
                // 再帰呼び出し: valueJSON は unknown だが、fromJSON は unknown を受け取るのでOK
                const childFS = FeatureStructure.fromJSON(valueJSON, types, context);

                fs.add(key, childFS, types);
            }

            return fs;
        }

        // 文字列でも有効なオブジェクトでもない場合
        throw new Error(`Invalid JSON format for Feature Structure: ${JSON.stringify(json)}`);
    }

    private static isAVM(value: unknown): value is FeatureStructureAVM {
        if (typeof value !== "object" || value === null) {
            return false;
        }
        const record = value as Record<string, unknown>;
        return typeof record.type === "string";
    }
} 