import type { Node as ParseNode } from "../../lib/nlp/core/parser";

export type MotherFormatterResult =
  | string
  | {
      label: string;
      meta?: string;
      title?: string;
    };

type Props<T> = {
  root: ParseNode<T>;
  formatMother?: (mother: T) => MotherFormatterResult;
};

const defaultFormatMother = (mother: unknown): string => {
  if (typeof mother === "string") return mother;
  if (typeof mother === "number" || typeof mother === "boolean")
    return String(mother);
  if (mother === null) return "null";
  if (mother === undefined) return "undefined";
  if (
    typeof mother === "object" &&
    mother !== null &&
    "toString" in mother &&
    typeof (mother as { toString?: unknown }).toString === "function" &&
    (mother as { toString: () => string }).toString !== Object.prototype.toString
  ) {
    return String(mother);
  }
  try {
    return JSON.stringify(mother);
  } catch {
    return String(mother);
  }
};

function isTerminal<T>(node: ParseNode<T>): boolean {
  return node.rule === "terminal";
}

function getChildren<T>(node: ParseNode<T>): ParseNode<T>[] {
  const children: ParseNode<T>[] = [];
  if (node.left) children.push(node.left);
  if (node.right) children.push(node.right);
  return children;
}

function getMergeRule<T>(node: ParseNode<T>): string | null {
  if (isTerminal(node)) return null;
  if (!node.left || !node.right) return null;
  const trimmed = node.rule.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function TreeItem<T>({
  node,
  formatMother,
}: {
  node: ParseNode<T>;
  formatMother: (mother: T) => MotherFormatterResult;
}) {
  const children = getChildren(node);
  const mergeRule = getMergeRule(node);

  const formatted = formatMother(node.mother);
  const labelText = typeof formatted === "string" ? formatted : formatted.label;
  const metaText = typeof formatted === "string" ? undefined : formatted.meta;
  const titleText = typeof formatted === "string" ? undefined : formatted.title;

  return (
    <li>
      <div className="syntax-tree__label" title={titleText}>
        <div className="text-xs font-semibold text-gray-900 break-words">
          {labelText}
        </div>
        {metaText && (
          <div className="mt-0.5 text-[11px] text-gray-600 break-words">
            {metaText}
          </div>
        )}
        {node.token && (
          <div className="mt-0.5 font-mono text-[11px] text-gray-600">
            {node.token}
          </div>
        )}
      </div>
      {children.length > 0 && (
        <div
          className={
            mergeRule
              ? "syntax-tree__children syntax-tree__children--merge"
              : "syntax-tree__children"
          }
        >
          {mergeRule && (
            <div className="syntax-tree__edge-label" aria-label={`Rule: ${mergeRule}`}>
              {mergeRule}
            </div>
          )}
          <ul>
            {children.map((child, idx) => (
              <TreeItem
                // Tree nodes are structural objects without stable ids; index is OK here.
                key={idx}
                node={child}
                formatMother={formatMother}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export function SyntaxTree<T>({ root, formatMother }: Props<T>) {
  const resolvedFormatMother: (mother: T) => MotherFormatterResult =
    formatMother ?? ((mother: T) => defaultFormatMother(mother));

  return (
    <ul className="syntax-tree">
      <TreeItem node={root} formatMother={resolvedFormatMother} />
    </ul>
  );
}
