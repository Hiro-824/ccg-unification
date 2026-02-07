"use client";

import { useMemo, useState } from "react";
import { FeatureStructure } from "../../lib/nlp/features/features";
import { formatFeatureStructureAvm } from "../../lib/nlp/features/format-avm";

type Props = {
  grammarId: string;
  words: string[];
  getEntries: (word: string) => unknown[];
};

function formatFallback(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (
    typeof value === "object" &&
    value !== null &&
    "toString" in value &&
    typeof (value as { toString?: unknown }).toString === "function" &&
    (value as { toString: () => string }).toString !== Object.prototype.toString
  ) {
    return String(value);
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function Dictionary({ grammarId, words, getEntries }: Props) {
  const [query, setQuery] = useState("");
  const [openWords, setOpenWords] = useState<Set<string>>(() => new Set());
  const [entriesByWord, setEntriesByWord] = useState<Record<string, unknown[]>>(
    () => ({}),
  );

  const isEmpty = words.length === 0;
  const normalizedQuery = query.trim().toLowerCase();

  const filteredWords = useMemo(() => {
    if (!normalizedQuery) return words;
    return words.filter((word) => word.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery, words]);

  const toggleWord = (word: string) => {
    setOpenWords((prev) => {
      const next = new Set(prev);
      if (next.has(word)) {
        next.delete(word);
        return next;
      }
      next.add(word);
      return next;
    });

    setEntriesByWord((prev) => {
      if (prev[word]) return prev;
      return { ...prev, [word]: getEntries(word) };
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">Dictionary</span>
            <span className="text-xs text-gray-500">
              {words.length} word{words.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Search by spelling and expand a word to view its lexical entries.
          </p>
        </div>

        <div className="w-full sm:max-w-xs">
          <label htmlFor="dictionary-search" className="sr-only">
            Search dictionary
          </label>
          <input
            id="dictionary-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search words…"
            disabled={isEmpty}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600">
          No vocabulary registered for this grammar.
        </div>
      ) : filteredWords.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600">
          No words match <span className="font-mono">{normalizedQuery}</span>.
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-100">
            {filteredWords.map((word) => {
              const isOpen = openWords.has(word);
              const entries = entriesByWord[word] ?? null;

              return (
                <li key={word} className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleWord(word)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-gray-900">
                      {word}
                    </span>
                    <span className="text-xs text-gray-500">
                      {entries ? `${entries.length} entr${entries.length === 1 ? "y" : "ies"}` : "Show"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 space-y-3">
                      {!entries || entries.length === 0 ? (
                        <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-600">
                          No lexical entries.
                        </div>
                      ) : (
                        entries.map((entry, idx) => {
                          const title =
                            entries.length > 1 ? `Entry ${idx + 1}` : "Entry";

                          const body =
                            grammarId === "hpsg" && entry instanceof FeatureStructure
                              ? formatFeatureStructureAvm(entry)
                              : formatFallback(entry);

                          return (
                            <div
                              key={idx}
                              className="rounded-md border border-gray-200 bg-gray-50"
                            >
                              <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
                                <span className="text-xs font-semibold text-gray-800">
                                  {title}
                                </span>
                                {grammarId === "hpsg" && entry instanceof FeatureStructure && (
                                  <span className="text-[11px] text-gray-500">
                                    AVM
                                  </span>
                                )}
                              </div>
                              <pre className="max-h-[320px] overflow-auto whitespace-pre p-3 font-mono text-xs text-gray-900">
                                {body}
                              </pre>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
