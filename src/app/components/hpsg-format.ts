import type { MotherFormatterResult } from "./syntax-tree";

type FeatureStructureLike = {
  getType: () => string;
  get: (attribute: string) => unknown;
  getIn?: (path: string[]) => unknown;
  toString: (...args: unknown[]) => string;
};

export function isHpsgFeatureStructure(
  value: unknown,
): value is FeatureStructureLike {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.getType === "function" &&
    typeof record.get === "function" &&
    typeof record.toString === "function"
  );
}

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

function formatAgr(value: unknown): string | null {
  if (!isHpsgFeatureStructure(value)) return null;
  const per = getType(getIn(value, ["PER"]));
  const num = getType(getIn(value, ["NUM"]));
  const gend = getType(getIn(value, ["GEND"]));
  const parts = [per, num, gend].filter(
    (part): part is string =>
      Boolean(part) && part !== "per" && part !== "num" && part !== "gend",
  );
  return parts.length ? parts.join("/") : null;
}

function expListLength(value: unknown, max = 6): number | `${number}+` | null {
  if (!isHpsgFeatureStructure(value)) return null;

  let length = 0;
  let current: unknown = value;

  while (length < max) {
    if (!isHpsgFeatureStructure(current)) return null;
    const type = current.getType();
    if (type === "exp-list-empty") return length;
    if (type !== "exp-list-cons") return null;
    length += 1;
    current = current.get("REST");
  }

  return `${max}+`;
}

export function formatHpsgMother(mother: unknown): MotherFormatterResult {
  if (!isHpsgFeatureStructure(mother)) {
    return String(mother);
  }

  const type = getType(mother) ?? "<?>";
  const head = getType(getIn(mother, ["SYN", "HEAD"]));
  const displayHead = head && head !== "pos" ? head : null;

  const valSpr = expListLength(getIn(mother, ["SYN", "VAL", "SPR"]));
  const valComps = expListLength(getIn(mother, ["SYN", "VAL", "COMPS"]));
  const valMod = expListLength(getIn(mother, ["SYN", "VAL", "MOD"]));

  const caseType = getType(getIn(mother, ["SYN", "HEAD", "CASE"]));
  const auxType = getType(getIn(mother, ["SYN", "HEAD", "AUX"]));
  const countType = getType(getIn(mother, ["SYN", "HEAD", "COUNT"]));
  const agrType = formatAgr(getIn(mother, ["SYN", "HEAD", "AGR"]));

  const metaParts: string[] = [];

  if (agrType) metaParts.push(`AGR=${agrType}`);
  if (caseType && caseType !== "case") metaParts.push(`CASE=${caseType}`);
  if (auxType && auxType !== "bool") metaParts.push(`AUX=${auxType}`);
  if (countType && countType !== "bool") metaParts.push(`COUNT=${countType}`);
  if (typeof valSpr === "string" || (typeof valSpr === "number" && valSpr > 0))
    metaParts.push(`SPR=${valSpr}`);
  if (
    typeof valComps === "string" ||
    (typeof valComps === "number" && valComps > 0)
  )
    metaParts.push(`COMPS=${valComps}`);
  if (typeof valMod === "string" || (typeof valMod === "number" && valMod > 0))
    metaParts.push(`MOD=${valMod}`);

  const meta = metaParts.length ? metaParts.join(" · ") : undefined;

  let title: string | undefined;
  try {
    title = mother.toString();
    if (title.length > 2000) title = `${title.slice(0, 2000)} …`;
  } catch {
    title = undefined;
  }

  const label = displayHead ? `${type} (${displayHead})` : type;
  return { label, meta, title };
}
