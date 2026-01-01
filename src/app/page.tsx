import { CombinatoryCategorialGrammar } from "../grammar/ccg";
import { atom, complex, Lexicon } from "../lexicon/lexicon";
import { parse } from "../parser/parser";

export default function Home() {

  const lexicon = new Lexicon();
  lexicon.add("John", [atom("NP"), complex(atom("S"), "/", complex(atom("S"), "\\", atom("NP")))]);
  lexicon.add("Mary", [atom("NP"), complex(atom("S"), "/", complex(atom("S"), "\\", atom("NP")))]);
  lexicon.add("apples", [atom("NP")]);
  lexicon.add("might", [complex(complex(atom("S"), "\\", atom("NP")), "/", complex(atom("S"), "\\", atom("NP")))]);
  lexicon.add("likes", [complex(complex(atom("S"), "\\", atom("NP")), "/", atom("NP"))]);
  lexicon.add("loves", [complex(complex(atom("S"), "\\", atom("NP")), "/", atom("NP"))]);
  const X = complex(atom("S"), "/", atom("NP"));
  lexicon.add("and", [
    complex(
      complex(X, "\\", X),
      "/",
      X
    )
  ]);
  const grammar = new CombinatoryCategorialGrammar(lexicon);
  const result = parse(["John", "likes", "and", "Mary", "loves", "apples"], grammar);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Parse Result</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  );
}
