import { TypeDefinition, TypedFeatureStructure, TypeName } from "./types";

export class TypeSystem {
    private typeMap: Map<string, TypeDefinition>;

    constructor(definitions: TypeDefinition[]) {
        this.typeMap = new Map();
        for (const def of definitions) {
            this.typeMap.set(def.typeName, def);
        }
    }

    isValid(tfs: TypedFeatureStructure): boolean {
        const satisfyAppropriatenessConditions = this.satisfyAppropriatenessConditions(tfs);
        if(!satisfyAppropriatenessConditions) return false;
        const satisfyValueConstraints = this.satisfyValueConstraints(tfs);
        return satisfyValueConstraints;
    }

    satisfyAppropriatenessConditions(tfs: TypedFeatureStructure): boolean {
        // TODO: implement the logic to check if `tfs` has only the keys it can have, based on `definitions`.
        return true;
    }

    satisfyValueConstraints(tfs: TypedFeatureStructure): boolean {
        // TODO: implement the logic to check if the value type matches with that of `definitions` for each of the `tfs`'s keys.
        return true;
    }

    private getAllAppropriateFeatures(typeName: TypeName): Record<string, string> {
        // You need to write this.
        // Logic: 
        // 1. Find the TypeDefinition.
        // 2. Recursively get features from `parentTypes`.
        // 3. Merge them with the local `appropriateFeatures`.
    }

    private isSubtype(child: TypeName, parent: TypeName): boolean {
        // Logic: Is 'child' the same as 'parent', or is 'parent' found in the recursive list of 'child's ancestors?
    }
}