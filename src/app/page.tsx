"use client";

import { FormEvent, useMemo, useState } from "react";
import { contextFreeGrammar } from "../parser/cfg";
import { parse } from "../parser/parser";
type ParseOutcome = {
  tokens: string[];
  categories: string[];
};

export default function Home() {
  const vocabulary = useMemo(
    () =>
      Object.entries(contextFreeGrammar.words).map(([word, categories]) => ({
        word,
        categories,
      })),
    []
  );
  const [sentence, setSentence] = useState("");
  const [result, setResult] = useState<ParseOutcome | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tokens = sentence
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (tokens.length === 0) {
      setError("Type a sentence using the words below.");
      setResult(null);
      return;
    }

    const unknown = tokens.filter(
      (token) => !contextFreeGrammar.words[token]
    );
    if (unknown.length > 0) {
      setError(`Unknown word${unknown.length > 1 ? "s" : ""}: ${unknown.join(", ")}`);
      setResult(null);
      return;
    }

    const categories = Array.from(
      new Set(parse(tokens, contextFreeGrammar))
    );
    setResult({ tokens, categories });
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Grammar Playground
          </p>
          <h1 className="text-3xl font-semibold">Sentence Builder</h1>
          <p className="max-w-2xl text-base text-slate-600">
            Choose from the available vocabulary, type a sentence, and see how
            the grammar parses it. Use only the words listed below.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">Available words</h2>
              <p className="text-sm text-slate-600">
                Tap a word to copy it into your sentence.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {vocabulary.map(({ word, categories }) => (
              <button
                key={word}
                type="button"
                onClick={() =>
                  setSentence((current) =>
                    current ? `${current.trim()} ${word}` : word
                  )
                }
                className="group rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
              >
                <div className="font-semibold group-hover:text-slate-900">
                  {word}
                </div>
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  {categories.join(", ")}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-800">
                Type your sentence
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="e.g. John sees a dog"
                value={sentence}
                onChange={(event) => setSentence(event.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:translate-y-[1px]"
              >
                Parse sentence
              </button>
              <button
                type="button"
                onClick={() => {
                  setSentence("");
                  setResult(null);
                  setError(null);
                }}
                className="text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Clear
              </button>
              {error && (
                <span className="text-sm font-medium text-red-600">{error}</span>
              )}
            </div>
          </form>

          {result && (
            <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Parse result
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-slate-800">
                {result.tokens.map((token, index) => (
                  <span
                    key={`${token}-${index}`}
                    className="rounded-md bg-white px-2 py-1 font-semibold text-slate-900 shadow-sm"
                  >
                    {token}
                  </span>
                ))}
              </div>
              {result.categories.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Derives
                  </span>
                  {result.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium text-red-700">
                  This sentence cannot be parsed by the current grammar.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
