import { isHpsgFeatureStructure } from "./hpsg-format";

type FeatureStructureLike = {
  getType: () => string;
  get: (attribute: string) => unknown;
  getIn?: (path: string[]) => unknown;
  toString: (...args: unknown[]) => string;
  dereference?: () => unknown;
};

function getIn(fs: FeatureStructureLike, path: string[]): unknown {
  if (typeof fs.getIn === "function") return fs.getIn(path);
  let current: unknown = fs;
  for (const attr of path) {
    if (!isHpsgFeatureStructure(current)) return undefined;
    current = current.get(attr);
  }
  return current;
}

function getType(value: unknown): string | null {
  if (!isHpsgFeatureStructure(value)) return null;
  try {
    return value.getType();
  } catch {
    return null;
  }
}

function dereference(value: FeatureStructureLike): FeatureStructureLike {
  const maybe = value as FeatureStructureLike;
  if (typeof maybe.dereference === "function") {
    const real = maybe.dereference();
    if (isHpsgFeatureStructure(real)) return real;
  }
  return value;
}

function clampText(value: string, max = 2000): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)} …`;
}

type Meaning = {
  summary: string;
  details?: string;
};

function collectPredications(restr: unknown, max = 50): FeatureStructureLike[] | null {
  if (!isHpsgFeatureStructure(restr)) return null;

  const predications: FeatureStructureLike[] = [];
  const seen = new WeakSet<object>();

  let current: unknown = restr;
  while (predications.length < max) {
    if (!isHpsgFeatureStructure(current)) return null;
    const real = dereference(current);
    if (seen.has(real as unknown as object)) break;
    seen.add(real as unknown as object);

    const type = getType(real);
    if (type === "pred-list-empty") return predications;
    if (type !== "pred-list-cons") return null;

    const first = getIn(real, ["FIRST"]);
    if (isHpsgFeatureStructure(first)) predications.push(first);
    const rest = getIn(real, ["REST"]);
    if (!rest) return predications;
    current = rest;
  }

  return predications;
}

function makeIndexNamer() {
  const names = new WeakMap<object, string>();
  let next = 1;

  return (value: unknown): string | null => {
    if (!isHpsgFeatureStructure(value)) return null;
    if (getType(value) !== "index") return null;

    const real = dereference(value) as unknown as object;
    const existing = names.get(real);
    if (existing) return existing;

    const assigned = `x${next++}`;
    names.set(real, assigned);
    return assigned;
  };
}

function formatPredication(
  pred: FeatureStructureLike,
  nameIndex: (value: unknown) => string | null,
): string | null {
  const relnNode = getIn(pred, ["RELN"]);
  const reln = getType(relnNode);
  if (!reln) return null;

  const args: string[] = [];
  for (const key of ["ARG1", "ARG2", "ARG3"] as const) {
    const arg = getIn(pred, [key]);
    if (!arg) continue;

    const indexName = nameIndex(arg);
    if (indexName) {
      args.push(indexName);
      continue;
    }

    const argType = getType(arg);
    if (argType && argType !== "top") {
      args.push(argType);
      continue;
    }

    args.push(String(arg));
  }

  return args.length ? `${reln}(${args.join(", ")})` : reln;
}

export function interpretHpsgSemantics(mother: unknown): Meaning | null {
  if (!isHpsgFeatureStructure(mother)) return null;

  const sem = getIn(mother, ["SEM"]);
  if (!isHpsgFeatureStructure(sem)) return null;

  const nameIndex = makeIndexNamer();

  const modeType = getType(getIn(sem, ["MODE"]));
  const mode =
    modeType && modeType !== "mode" && modeType !== "none" ? modeType : null;

  const indexVar = nameIndex(getIn(sem, ["INDEX"]));

  const predications = collectPredications(getIn(sem, ["RESTR"]));
  const restrictions =
    predications?.map((pred) => formatPredication(pred, nameIndex)).filter(
      (text): text is string => Boolean(text),
    ) ?? [];

  const restrText = restrictions.length ? restrictions.join(" ∧ ") : "";

  const summary = mode
    ? `${mode}${indexVar ? `(${indexVar})` : ""}${restrText ? `: ${restrText}` : ""}`
    : restrText || indexVar || "(no SEM content)";

  const detailsLines: string[] = [];
  if (mode) detailsLines.push(`MODE: ${mode}`);
  if (indexVar) detailsLines.push(`INDEX: ${indexVar}`);
  if (restrictions.length) {
    detailsLines.push("RESTR:");
    for (const item of restrictions) detailsLines.push(`- ${item}`);
  } else if (predications === null) {
    try {
      detailsLines.push("RESTR: (unparsed)");
      detailsLines.push(clampText(sem.toString()));
    } catch {
      // ignore
    }
  }

  if (detailsLines.length === 0) {
    try {
      detailsLines.push(clampText(sem.toString()));
    } catch {
      // ignore
    }
  }

  return {
    summary,
    details: detailsLines.length ? detailsLines.join("\n") : undefined,
  };
}
