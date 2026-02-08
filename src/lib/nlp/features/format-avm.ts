import { FeatureStructure } from "./features";

type FormatOptions = {
  indent?: number;
  sortAttributes?: boolean;
};

function collectReferenceCounts(root: FeatureStructure): Map<FeatureStructure, number> {
  const counts = new Map<FeatureStructure, number>();
  const expanded = new Set<FeatureStructure>();

  const visit = (node: FeatureStructure) => {
    const real = node.dereference();
    counts.set(real, (counts.get(real) ?? 0) + 1);
    if (expanded.has(real)) return;
    expanded.add(real);

    for (const attr of real.getAttributes()) {
      const child = real.get(attr);
      if (!child) continue;
      visit(child);
    }
  };

  visit(root);
  return counts;
}

export function formatFeatureStructureAvm(
  root: FeatureStructure,
  options: FormatOptions = {},
): string {
  const indentSize = options.indent ?? 2;
  const sortAttributes = options.sortAttributes ?? false;

  const refCounts = collectReferenceCounts(root);
  const ids = new Map<FeatureStructure, number>();
  const printed = new Set<FeatureStructure>();
  let nextId = 1;

  const getId = (node: FeatureStructure): number => {
    const real = node.dereference();
    const existing = ids.get(real);
    if (existing) return existing;
    const assigned = nextId++;
    ids.set(real, assigned);
    return assigned;
  };

  const isShared = (node: FeatureStructure): boolean =>
    (refCounts.get(node.dereference()) ?? 0) > 1;

  const formatNode = (node: FeatureStructure, indent: number): string => {
    const real = node.dereference();
    const shared = isShared(real);
    const idPrefix = shared ? `#${getId(real)}` : null;

    if (shared && printed.has(real)) {
      return `${" ".repeat(indent)}${idPrefix}`;
    }

    const attributes = Array.from(real.getAttributes());
    if (sortAttributes) attributes.sort((a, b) => a.localeCompare(b));

    if (attributes.length === 0) {
      const head = idPrefix ? `${idPrefix} ` : "";
      return `${" ".repeat(indent)}${head}${real.getType()}`;
    }

    if (shared) printed.add(real);

    const head = idPrefix ? `${idPrefix} ` : "";
    const lines: string[] = [];
    lines.push(`${" ".repeat(indent)}${head}[${real.getType()}`);

    for (const attr of attributes) {
      const child = real.get(attr);
      if (!child) continue;

      const childText = formatNode(child, indent + indentSize);
      if (childText.includes("\n")) {
        lines.push(`${" ".repeat(indent + indentSize)}${attr}:`);
        lines.push(childText);
      } else {
        lines.push(
          `${" ".repeat(indent + indentSize)}${attr}: ${childText.trimStart()}`,
        );
      }
    }

    lines.push(`${" ".repeat(indent)}]`);
    return lines.join("\n");
  };

  return formatNode(root, 0);
}

