import { TypeName, TypeSystem } from "./types";

export type Attribute = string;

export type FeatureStructureInput = string | FeatureStructureAVM;
export interface FeatureStructureAVM {
    type: string;
    _id?: string;
    [key: string]: unknown;
}

type FeatureCell = { value: FeatureStructure; isDefault: boolean };
type UnifyOptions = { skipNormalize?: boolean };
type FromJSONOptions = { skipNormalize?: boolean };
type DeepCopyOptions = { forceDefault?: boolean; skipNormalize?: boolean };

export class FeatureStructure {

    private _type: TypeName = "top";
    private _features: Map<Attribute, FeatureCell> = new Map();
    _forward: FeatureStructure | null = null;

    constructor(type: TypeName) {
        this._type = type;
    }

    private static getPerTypeCache<T>(
        root: WeakMap<TypeSystem, Map<TypeName, T>>,
        types: TypeSystem
    ): Map<TypeName, T> {
        const existing = root.get(types);
        if (existing) return existing;
        const created = new Map<TypeName, T>();
        root.set(types, created);
        return created;
    }

    private static getPerNodeCache<T>(
        root: WeakMap<TypeSystem, Map<FeatureStructure, T>>,
        types: TypeSystem
    ): Map<FeatureStructure, T> {
        const existing = root.get(types);
        if (existing) return existing;
        const created = new Map<FeatureStructure, T>();
        root.set(types, created);
        return created;
    }

    private static getInProgressSet(types: TypeSystem): Set<FeatureStructure> {
        const existing = this._normalizeInProgress.get(types);
        if (existing) return existing;
        const created = new Set<FeatureStructure>();
        this._normalizeInProgress.set(types, created);
        return created;
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
        return this._features.get(attribute)?.value;
    }

    private getCell(attribute: Attribute): FeatureCell | undefined {
        const realNode = this.dereference();
        if (realNode !== this) return realNode.getCell(attribute);
        return this._features.get(attribute);
    }

    private setCell(attribute: Attribute, cell: FeatureCell): void {
        const realNode = this.dereference();
        if (realNode !== this) {
            realNode.setCell(attribute, cell);
            return;
        }
        this._features.set(attribute, cell);
    }

    private addInternal(
        attribute: Attribute,
        value: FeatureStructure,
        types: TypeSystem,
        options: { isDefault: boolean; skipNormalize: boolean }
    ): void {
        const realNode = this.dereference();
        if (realNode !== this) {
            realNode.addInternal(attribute, value, types, options);
            return;
        }

        if (!options.skipNormalize) {
            realNode.normalize(types);
            value.normalize(types);
        }

        const appropriateType = types.getAppropriateType(this._type, attribute);
        if (appropriateType === null) {
            throw new Error(`The feature ${attribute} does not exist on ${this._type}.`);
        }
        if (types.unifyTypes(appropriateType, value.getType()) === null) {
            throw new Error(`The value type ${value.getType()} is not compatible with ${appropriateType}.`);
        }

        const existing = this._features.get(attribute);
        if (!existing) {
            this._features.set(attribute, { value, isDefault: options.isDefault });
            if (!options.skipNormalize) realNode.normalize(types);
            return;
        }

        // default vs explicit resolution
        if (existing.isDefault && !options.isDefault) {
            // explicit overrides default (prefer merge if compatible)
            if (FeatureStructure.canUnify(existing.value, value, types)) {
                FeatureStructure.unify(value, existing.value, types, { skipNormalize: true });
                existing.value = existing.value.dereference();
            } else {
                existing.value = value;
            }
            existing.isDefault = false;
            if (!options.skipNormalize) realNode.normalize(types);
            return;
        }

        if (!existing.isDefault && options.isDefault) {
            // apply default only if it doesn't conflict with explicit info
            if (FeatureStructure.canUnify(existing.value, value, types)) {
                FeatureStructure.unify(value, existing.value, types, { skipNormalize: true });
                existing.value = existing.value.dereference();
            }
            if (!options.skipNormalize) realNode.normalize(types);
            return;
        }

        // both default or both explicit: must unify
        FeatureStructure.unify(value, existing.value, types, { skipNormalize: true });
        existing.value = existing.value.dereference();
        existing.isDefault = existing.isDefault && options.isDefault;
        if (!options.skipNormalize) realNode.normalize(types);
    }

    add(attribute: Attribute, value: FeatureStructure, types: TypeSystem) {
        this.addInternal(attribute, value, types, { isDefault: false, skipNormalize: false });
    }

    addDefault(attribute: Attribute, value: FeatureStructure, types: TypeSystem) {
        this.addInternal(attribute, value, types, { isDefault: true, skipNormalize: false });
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
        const child = this._features.get(head)?.value;

        if (!child) return undefined;
        return child.getIn(path.slice(1));
    }

    toString(visited: Map<FeatureStructure, number> = new Map()): string {
        const realNode = this.dereference();
        if (realNode !== this) return realNode.toString(visited);
        if (visited.has(realNode)) return `<${visited.get(realNode)}>`;
        visited.set(realNode, visited.size + 1);
        const entries = Array.from(this._features.entries())
            .map(([attr, cell]) => `${attr}: ${cell.value.toString(visited)}`);
        return `${this._type}[ ${entries.join(", ")} ]`;
    }

    // 内部のToken Identityを保ったままコピーを作る
    deepCopy(
        memo: Map<FeatureStructure, FeatureStructure> = new Map(),
        types: TypeSystem,
        options: DeepCopyOptions = {}
    ): FeatureStructure {
        const realSource = this.dereference();
        if (memo.has(realSource)) {
            return memo.get(realSource)!;
        }
        const copy = new FeatureStructure(realSource._type);
        memo.set(realSource, copy);
        for (const [attr, cell] of realSource._features) {
            const isDefault = options.forceDefault ? true : cell.isDefault;
            const childCopy = cell.value.deepCopy(memo, types, options);
            copy.addInternal(attr, childCopy, types, { isDefault, skipNormalize: true });
        }
        if (!options.skipNormalize) copy.normalize(types);
        return copy;
    }

    private static canUnify(a: FeatureStructure, b: FeatureStructure, types: TypeSystem): boolean {
        const aCopy = a.deepCopy(new Map(), types, { skipNormalize: true });
        const bCopy = b.deepCopy(new Map(), types, { skipNormalize: true });
        try {
            FeatureStructure.unify(aCopy, bCopy, types, { skipNormalize: true });
            return true;
        } catch {
            return false;
        }
    }

    static unify(
        fs1: FeatureStructure,
        fs2: FeatureStructure,
        types: TypeSystem,
        options: UnifyOptions = {}
    ): void {
        if (!options.skipNormalize) {
            fs1.normalize(types);
            fs2.normalize(types);
        }

        const n1 = fs1.dereference();
        const n2 = fs2.dereference();

        if (n1 === n2) return;

        const newType = types.unifyTypes(n1.getType(), n2.getType());
        if (newType === null) throw new Error("Unification Failed");

        const featuresToMerge: Array<[Attribute, FeatureCell]> = [];
        for (const [key, cell] of n1._features.entries()) {
            featuresToMerge.push([key, { value: cell.value, isDefault: cell.isDefault }]);
        }

        n2.setType(newType);
        n1._forward = n2;

        for (const [key, cell1] of featuresToMerge) {
            const cell2 = n2._features.get(key);

            if (cell2) {
                try {
                    FeatureStructure.unify(cell1.value, cell2.value, types, { skipNormalize: true });
                    cell2.value = cell2.value.dereference();
                    cell2.isDefault = cell1.isDefault && cell2.isDefault;
                } catch (e) {
                    const c1d = cell1.isDefault;
                    const c2d = cell2.isDefault;

                    if (c1d && !c2d) {
                        // ignore default from fs1
                        continue;
                    }
                    if (!c1d && c2d) {
                        // explicit overrides default in fs2
                        cell2.value = cell1.value;
                        cell2.isDefault = false;
                        continue;
                    }
                    throw e;
                }
            } else {
                n2._features.set(key, { value: cell1.value, isDefault: cell1.isDefault });
            }
        }

        if (!options.skipNormalize) n2.normalize(types);
    }

    static fromJSON(
        json: unknown,
        types: TypeSystem,
        context: Map<string, FeatureStructure> = new Map(),
        options: FromJSONOptions = {}
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
            const fs = new FeatureStructure(json);
            if (!options.skipNormalize) fs.normalize(types);
            return fs;
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
                const childFS = FeatureStructure.fromJSON(valueJSON, types, context, { skipNormalize: true });

                fs.addInternal(key, childFS, types, { isDefault: false, skipNormalize: true });
            }

            if (!options.skipNormalize) fs.normalize(types);
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

    normalize(types: TypeSystem): void {
        FeatureStructure.normalizeInternal(this, types, new Set());
    }

    private static normalizeInternal(node: FeatureStructure, types: TypeSystem, visited: Set<FeatureStructure>): void {
        const realNode = node.dereference();
        if (visited.has(realNode)) return;
        visited.add(realNode);

        const inProgress = this.getInProgressSet(types);
        if (inProgress.has(realNode)) return;
        inProgress.add(realNode);

        try {
            const normalizedFor = this.getPerNodeCache(this._normalizedForType, types);

            while (true) {
                const beforeType = realNode.getType();
                if (normalizedFor.get(realNode) === beforeType) break;

                const constraintProto = this.getEffectiveConstraintPrototype(beforeType, types);
                if (constraintProto) {
                    const copy = constraintProto.deepCopy(new Map(), types, { skipNormalize: true });
                    FeatureStructure.unify(copy, realNode, types, { skipNormalize: true });
                }

                const defaultsProto = this.getEffectiveDefaultsPrototype(realNode.getType(), types);
                if (defaultsProto) {
                    FeatureStructure.applyDefaultsFromPrototype(realNode, defaultsProto, types);
                }

                normalizedFor.set(realNode, realNode.getType());
                if (realNode.getType() === beforeType) break;
            }

            for (const cell of realNode._features.values()) {
                FeatureStructure.normalizeInternal(cell.value, types, visited);
            }
        } finally {
            inProgress.delete(realNode);
        }
    }

    private static getEffectiveConstraintPrototype(type: TypeName, types: TypeSystem): FeatureStructure | null {
        const cache = this.getPerTypeCache(this._constraintPrototypeCache, types);
        if (cache.has(type)) return cache.get(type) ?? null;

        const lineage = types.getTypeLineage(type);
        let acc: FeatureStructure | null = null;

        for (const t of lineage) {
            const def = types.getConstraint(t);
            if (!def) continue;

            const parsed = FeatureStructure.fromJSON(def, types, new Map(), { skipNormalize: true });
            if (!acc) {
                acc = parsed;
            } else {
                FeatureStructure.unify(parsed, acc, types, { skipNormalize: true });
                acc = acc.dereference();
            }
        }

        cache.set(type, acc ?? null);
        return acc;
    }

    private static getEffectiveDefaultsPrototype(type: TypeName, types: TypeSystem): FeatureStructure | null {
        const cache = this.getPerTypeCache(this._defaultsPrototypeCache, types);
        if (cache.has(type)) return cache.get(type) ?? null;

        const lineage = types.getTypeLineage(type);
        let acc: FeatureStructure | null = null;

        for (const t of lineage) {
            const def = types.getDefaults(t);
            if (!def) continue;

            const parsed = FeatureStructure.fromJSON(def, types, new Map(), { skipNormalize: true });
            if (!acc) {
                acc = parsed;
            } else {
                acc = FeatureStructure.mergePrototype(acc, parsed, types);
            }
        }

        cache.set(type, acc ?? null);
        return acc;
    }

    private static mergePrototype(base: FeatureStructure, override: FeatureStructure, types: TypeSystem): FeatureStructure {
        const b = base.dereference();
        const o = override.dereference();
        const memo = new Map<FeatureStructure, FeatureStructure>();

        const rootType = types.unifyTypes(b.getType(), o.getType());
        if (rootType === null) {
            throw new Error(`Incompatible defaults prototypes: ${b.getType()} vs ${o.getType()}`);
        }
        b.setType(rootType);

        for (const [attr, oCell] of o._features.entries()) {
            const bCell = b._features.get(attr);
            if (!bCell) {
                const childCopy = oCell.value.deepCopy(memo, types, { skipNormalize: true });
                b._features.set(attr, { value: childCopy, isDefault: false });
                continue;
            }

            const bChild = bCell.value.dereference();
            const oChild = oCell.value.dereference();

            const unified = types.unifyTypes(bChild.getType(), oChild.getType());
            if (unified === null) {
                bCell.value = oChild.deepCopy(memo, types, { skipNormalize: true });
                bCell.isDefault = false;
                continue;
            }

            bChild.setType(unified);
            FeatureStructure.mergePrototype(bChild, oChild, types);
        }

        return b;
    }

    private static applyDefaultsFromPrototype(target: FeatureStructure, proto: FeatureStructure, types: TypeSystem): void {
        const memo = new Map<FeatureStructure, FeatureStructure>();

        const apply = (tNode: FeatureStructure, pNode: FeatureStructure) => {
            const t = tNode.dereference();
            const p = pNode.dereference();

            for (const [attr, pCell] of p._features.entries()) {
                const existing = t._features.get(attr);

                if (!existing) {
                    const copy = pCell.value.deepCopy(memo, types, { forceDefault: true, skipNormalize: true });
                    t.addInternal(attr, copy, types, { isDefault: true, skipNormalize: true });
                    continue;
                }

                const tChild = existing.value.dereference();
                const pChild = pCell.value.dereference();
                if (types.unifyTypes(tChild.getType(), pChild.getType()) === null) continue;

                apply(tChild, pChild);
            }
        };

        apply(target, proto);
    }

    private static _constraintPrototypeCache: WeakMap<TypeSystem, Map<TypeName, FeatureStructure | null>> = new WeakMap();
    private static _defaultsPrototypeCache: WeakMap<TypeSystem, Map<TypeName, FeatureStructure | null>> = new WeakMap();
    private static _normalizedForType: WeakMap<TypeSystem, Map<FeatureStructure, TypeName>> = new WeakMap();
    private static _normalizeInProgress: WeakMap<TypeSystem, Set<FeatureStructure>> = new WeakMap();
}
