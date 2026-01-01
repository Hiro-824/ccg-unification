import { CombinatoryCategorialGrammar } from "../grammar/ccg";
import { atom, complex, Lexicon } from "../lexicon/lexicon";
import { parse } from "../parser/parser";

export default function Home() {

  const lexicon = new Lexicon();
  lexicon.add("John", [atom("NP")]);
  lexicon.add("walks", [complex(atom("S"), "\\", atom("NP"))]);
  const grammar = new CombinatoryCategorialGrammar(lexicon);
  const result = parse(["John", "walks"], grammar);

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
      <h1 style={{ fontFamily: "sans-serif" }}>Parse Result</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  );
}
