"use client";

import { useMemo, useState } from "react";
import { Grammar, parse, type Node as ParseNode } from "../lib/nlp/core/parser";
import { CFG } from "../lib/nlp/grammars/cfg/cfg";
import { SyntaxTree } from "./components/syntax-tree";
import { HPSG } from "../lib/nlp/grammars/hpsg/hpsg";
import { formatHpsgMother, isHpsgFeatureStructure } from "./components/hpsg-format";

type RegisteredGrammar = {
  id: string;
  label: string;
  build: () => Grammar<unknown>;
};

const GRAMMARS: RegisteredGrammar[] = [
  {
    id: "cfg",
    label: "Context-Free Grammar (demo)",
    build: () => new CFG(),
  },
  {
    id: "hpsg",
    label: "HPSG",
    build: () => new HPSG(),
  }
];

const normalizeSentence = (input: string): string =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const toWords = (input: string): string[] => {
  const normalized = normalizeSentence(input);
  return normalized ? normalized.split(" ") : [];
};

export default function Home() {
  const [grammarId, setGrammarId] = useState(GRAMMARS[0]?.id ?? "");
  const [rawSentence, setRawSentence] = useState("");
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<ParseNode<unknown>[] | null>(
    null,
  );

  const activeGrammarEntry = useMemo(
    () => GRAMMARS.find((g) => g.id === grammarId) ?? GRAMMARS[0],
    [grammarId],
  );

  const grammarInstance = useMemo(
    () => activeGrammarEntry?.build(),
    [activeGrammarEntry],
  );

  const vocabulary = useMemo(
    () => (grammarInstance ? grammarInstance.getAvailableWords() : []),
    [grammarInstance],
  );

  const vocabularySet = useMemo(
    () => new Set(vocabulary.map((word) => word.toLowerCase())),
    [vocabulary],
  );

  const handleGrammarChange = (nextId: string) => {
    setGrammarId(nextId);
    // Reset UI state when switching grammars to avoid stale messages/results.
    setWarning(null);
    setError(null);
    setParseResult(null);
  };

  const handleParse = () => {
    setWarning(null);
    setError(null);

    if (!grammarInstance) {
      setError("No grammar is available.");
      setParseResult(null);
      return;
    }

    const words = toWords(rawSentence);

    if (words.length === 0) {
      setError("Please enter a sentence to parse.");
      setParseResult(null);
      return;
    }

    const unknownWords = words.filter((word) => !vocabularySet.has(word));

    if (unknownWords.length > 0) {
      // Consistent behavior: skip parsing when out-of-vocabulary words are present.
      setWarning(`Unknown words: ${[...new Set(unknownWords)].join(", ")}`);
      setParseResult(null);
      return;
    }

    try {
      const result = parse(words, grammarInstance);
      setParseResult(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Parsing failed. Please try again.",
      );
      setParseResult(null);
    }
  };

  const formattedResult = useMemo(() => {
    if (parseResult === null) return "No result yet.";
    if (parseResult.length === 0) return "No parses found.";
    try {
      const seen = new WeakSet<object>();
      return JSON.stringify(
        parseResult,
        (_key, value) => {
          if (grammarId === "hpsg" && isHpsgFeatureStructure(value)) {
            const formatted = formatHpsgMother(value);
            if (typeof formatted === "object") {
              return formatted.title ?? formatted.label;
            }
            return formatted;
          }

          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
          }

          return value;
        },
        2,
      );
    } catch {
      return String(parseResult);
    }
  }, [grammarId, parseResult]);

  const parses = parseResult ?? [];
  const hasParses = parses.length > 0;

  const formatMotherForSummary = (mother: unknown): string => {
    if (grammarId === "hpsg") {
      const formatted = formatHpsgMother(mother);
      if (typeof formatted === "string") return formatted;
      return formatted.meta ? `${formatted.label} — ${formatted.meta}` : formatted.label;
    }

    if (typeof mother === "string") return mother;
    if (typeof mother === "number" || typeof mother === "boolean")
      return String(mother);
    if (mother === null) return "null";
    if (mother === undefined) return "undefined";
    try {
      return JSON.stringify(mother);
    } catch {
      return String(mother);
    }
  };

  const treeMotherFormatter = useMemo(() => {
    if (grammarId === "hpsg") return (mother: unknown) => formatHpsgMother(mother);
    return undefined;
  }, [grammarId]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Sentence Parser</p>
          <p className="text-sm text-gray-600">
            Select a grammar, review its vocabulary, enter a sentence, and parse it.
          </p>
        </header>

        <section className="grid gap-6">
          <div className="space-y-2">
            <label
              htmlFor="grammar"
              className="text-sm font-medium text-gray-800"
            >
              Grammar
            </label>
            <select
              id="grammar"
              value={grammarId}
              onChange={(event) => handleGrammarChange(event.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
            >
              {GRAMMARS.map((grammar) => (
                <option key={grammar.id} value={grammar.id}>
                  {grammar.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">
                Available words
              </span>
              <span className="text-xs text-gray-500">
                {vocabulary.length} word{vocabulary.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-3">
              {vocabulary.length ? (
                vocabulary.map((word) => (
                  <span
                    key={word}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-800"
                  >
                    {word}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  No vocabulary registered for this grammar.
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="sentence"
              className="text-sm font-medium text-gray-800"
            >
              Sentence
            </label>
            <textarea
              id="sentence"
              rows={3}
              value={rawSentence}
              onChange={(event) => setRawSentence(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
              placeholder="Type a sentence using the available words..."
            />
            <p className="text-xs text-gray-500">
              Input is lowercased and punctuation is removed before parsing.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleParse}
                className="inline-flex justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Parse
              </button>
              <button
                type="button"
                onClick={() => setRawSentence("john sees mary")}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
              >
                Use example
              </button>
              <span className="text-xs text-gray-500">
                Words are split on spaces after normalization.
              </span>
            </div>
          </div>

          {(warning || error) && (
            <div className="space-y-2">
              {warning && (
                <div
                  role="status"
                  className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
                >
                  {warning}
                </div>
              )}
              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                >
                  {error}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">
                Parse result
              </span>
            </div>
            {hasParses ? (
              <div className="space-y-6">
                {parses.map((root, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
                      <span className="text-xs font-semibold text-gray-800">
                        Parse {idx + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        Root: {formatMotherForSummary(root.mother)}
                      </span>
                    </div>
                    <div className="overflow-auto p-4">
                      <SyntaxTree root={root} formatMother={treeMotherFormatter} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="min-h-[120px] rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-inner">
                {formattedResult}
              </div>
            )}

            <details className="rounded-lg border border-gray-200 bg-gray-50">
              <summary className="cursor-pointer select-none px-4 py-2 text-sm font-medium text-gray-800">
                Raw JSON
              </summary>
              <pre className="max-h-[360px] overflow-auto border-t border-gray-200 p-4 text-xs text-gray-800">
                {formattedResult}
              </pre>
            </details>
          </div>
        </section>
      </div>
    </main>
  );
}
