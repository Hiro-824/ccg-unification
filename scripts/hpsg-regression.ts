import assert from "node:assert/strict";

import { parse } from "../src/lib/nlp/core/parser";
import { FeatureStructure } from "../src/lib/nlp/features/features";
import { TypeSystem } from "../src/lib/nlp/features/types";
import { HPSG } from "../src/lib/nlp/grammars/hpsg/hpsg";

function smokeTypeConstraintsAndDefaults() {
    const tsDefaults = new TypeSystem();
    tsDefaults.loadDefinition({
        b: { parent: "top" },
        b1: { parent: "b" },
        b2: { parent: "b" },
        a: {
            parent: "top",
            features: { F: "b" },
            defaults: { type: "a", F: "b1" }
        }
    });

    const x = new FeatureStructure("a");
    x.normalize(tsDefaults);
    assert.equal(x.get("F")?.getType(), "b1");

    x.add("F", new FeatureStructure("b2"), tsDefaults);
    assert.equal(x.get("F")?.getType(), "b2");

    const tsConstraints = new TypeSystem();
    tsConstraints.loadDefinition({
        b: { parent: "top" },
        b1: { parent: "b" },
        b2: { parent: "b" },
        a: {
            parent: "top",
            features: { F: "b" },
            constraint: { type: "a", F: "b1" },
            defaults: { type: "a", F: "b2" }
        }
    });

    const y = new FeatureStructure("a");
    y.normalize(tsConstraints);
    assert.equal(y.get("F")?.getType(), "b1");

    const z = new FeatureStructure("a");
    assert.throws(() => z.add("F", new FeatureStructure("b2"), tsConstraints));
}

function parses(sentence: string): number {
    const grammar = new HPSG();
    return parse(sentence.split(/\s+/).filter(Boolean), grammar).length;
}

function assertParses(sentence: string) {
    assert.ok(parses(sentence) > 0, `Expected parses for: "${sentence}"`);
}

function assertNoParses(sentence: string) {
    assert.equal(parses(sentence), 0, `Expected no parses for: "${sentence}"`);
}

// head-modifier should not allow arbitrary words to become modifiers
assertNoParses("kim mary");
assertNoParses("a mary");
assertNoParses("a walks");
assertNoParses("sees a");

smokeTypeConstraintsAndDefaults();

// sanity checks: core grammar should still build expected constituents
assertParses("kim walks");
assertParses("a telescope");
assertParses("with telescope");

// modifier should still work when lexicon licenses it ("with" has MOD)
assertParses("telescope with telescope");

// binding: anaphor must have antecedent in ARG-ST
assertParses("mary sees herself");
assertNoParses("herself sees mary");
assertParses("a girl sent herself a letter");

console.log("OK");
