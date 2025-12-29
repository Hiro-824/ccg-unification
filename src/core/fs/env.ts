import { FeatureValue } from "./types";

export class UnificationEnvironment {
    bindings: Map<string, FeatureValue>;

    constructor(bindings?: Map<string, FeatureValue>) {
        this.bindings = bindings ? new Map(bindings) : new Map();
    }

    // Create a copy of the current environment for branching
    clone(): UnificationEnvironment {
        return new UnificationEnvironment(this.bindings);
    }
}