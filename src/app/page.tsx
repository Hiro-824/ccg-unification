"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Grammar Playground
          </p>
          <h1 className="text-3xl font-semibold">Choose a parser</h1>
          <p className="max-w-2xl text-base text-slate-600">
            Each page lists its vocabulary and lets you type a sentence to see how that grammar parses it.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <a
            href="/cfg"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow"
          >
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              CFG
            </div>
            <div className="text-lg font-semibold text-slate-900">
              Context-Free Grammar
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Simple phrase-structure grammar with classic NP/VP rules.
            </p>
          </a>
          <a
            href="/ccg"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow"
          >
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              CCG
            </div>
            <div className="text-lg font-semibold text-slate-900">
              Combinatory Categorial Grammar
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Directional categories with forward/backward application.
            </p>
          </a>
          <a
            href="/complex-ccg"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow"
          >
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Complex CCG
            </div>
            <div className="text-lg font-semibold text-slate-900">
              Feature-based CCG
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Categories with feature structures and unification.
            </p>
          </a>
        </section>
      </div>
    </main>
  );
}
