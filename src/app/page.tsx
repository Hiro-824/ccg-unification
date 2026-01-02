"use client";

import { useState } from "react";
import { CCG } from "../lib/nlp/ccg/grammar";
import { FeatureStructureUnifier } from "../lib/nlp/features/unifier";
import { englishLexicon } from "../lib/nlp/lexicon/en";
import { parse } from "../lib/nlp/core/parser";

export default function Home() {
  const [input, setInput] = useState("I must see him");
  const [result, setResult] = useState<string>("");

  const runParse = () => {
    // 1. Setup Logic
    const unifier = new FeatureStructureUnifier();
    const grammar = new CCG(englishLexicon, unifier);

    // 2. Execute Parse
    const words = input.trim().split(/\s+/);
    const trees = parse(words, grammar);

    // 3. Display Result
    if (trees.length > 0) {
      setResult(JSON.stringify(trees, null, 2));
    } else {
      setResult("Parsing Failed (No valid tree found).");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>CCG Feature Structure Parser</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          style={{ width: "300px", padding: "5px", marginRight: "10px" }}
        />
        <button onClick={runParse} style={{ padding: "5px 10px" }}>
          Parse
        </button>
      </div>

      <h3>Result:</h3>
      <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
        {result}
      </pre>
    </div>
  );
}