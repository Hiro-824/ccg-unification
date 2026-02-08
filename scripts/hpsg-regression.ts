import assert from "node:assert/strict";

import { parse } from "../src/lib/nlp/core/parser";
import { HPSG } from "../src/lib/nlp/grammars/hpsg/hpsg";

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
