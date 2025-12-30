"use client";

import { complexCategorialGrammar as varCategorialGrammar } from "@/src/grammars/var-ccg";
import { parse } from "@/src/parser/parser";
import { FormEvent, useMemo, useState } from "react";

type FeatureValue = string | number | boolean | FeatureStructure | FeatureValue[];
interface FeatureStructure {
  [key: string]: FeatureValue;
}

type AtomicCategory = {
  kind: "AtomicCategory";
  features: FeatureStructure;
};

type ComplexCategory = {
  kind: "ComplexCategory";
  direction: "/" | "\\";
  argument: Category;
  result: Category;
};

type Category = AtomicCategory | ComplexCategory;

const formatFeatureValue = (value: FeatureValue): string => {
  if (Array.isArray(value)) {
    return `[${value.map((v) => formatFeatureValue(v)).join(", ")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .map(([key, val]) => `${key}=${formatFeatureValue(val)}`)
      .join(", ")}}`;
  }
  return String(value);
};

const formatAtomic = (category: AtomicCategory): string => {
  const entries = Object.entries(category.features);
  if (entries.length === 1 && entries[0][0] === "type" && typeof entries[0][1] === "string") {
    return String(entries[0][1]);
  }
  return `{${entries
    .map(([key, value]) => `${key}=${formatFeatureValue(value)}`)
    .join(", ")}}`;
};

const formatCategory = (category: Category): string => {
  if (category.kind === "AtomicCategory") return formatAtomic(category);
  const result = formatCategory(category.result);
  const argument = formatCategory(category.argument);
  const formattedResult =
    category.result.kind === "AtomicCategory" ? result : `(${result})`;
  const formattedArgument =
    category.argument.kind === "AtomicCategory" ? argument : `(${argument})`;
  return `${formattedResult}${category.direction}${formattedArgument}`;
};

type ParseOutcome = {
  tokens: string[];
  categories: string[];
};

export default function VarCCGPage() {
  const vocabulary = useMemo(
    () =>
      Object.entries(varCategorialGrammar.words).map(([word, categories]) => ({
        word,
        categories: categories.map((category) => formatCategory(category as Category)),
      })),
    []
  );
  const [sentence, setSentence] = useState("");
  const [result, setResult] = useState<ParseOutcome | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tokens = sentence
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (tokens.length === 0) {
      setResult(null);
      return;
    }
    const categories = Array.from(
      new Set(
        parse(tokens, varCategorialGrammar).map((category) =>
          formatCategory(category as Category)
        )
      )
    );
    setResult({ tokens, categories });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Var CCG Parser
          </p>
          <h1 className="text-3xl font-semibold">Feature-based CCG (Var)</h1>
          <p className="max-w-2xl text-base text-slate-600">
            Type a sentence using the vocabulary below and parse it.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Available words</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {vocabulary.map(({ word, categories }) => (
              <div
                key={word}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm"
              >
                <div className="font-semibold text-slate-900">{word}</div>
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  {categories.join(", ")}
                </div>
              </div>
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
                placeholder="e.g. John sees Mary"
                value={sentence}
                onChange={(event) => setSentence(event.target.value)}
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:translate-y-[1px]"
            >
              Parse sentence
            </button>
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
