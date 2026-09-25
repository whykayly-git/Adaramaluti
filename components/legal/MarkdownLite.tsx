/**
 * Renders the lightweight markdown-lite convention used by admin-edited
 * page content (see lib/page-content.ts). Builds React elements directly
 * rather than using dangerouslySetInnerHTML.
 */
export function MarkdownLite({ content }: { content: string }) {
  const blocks = content
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return <h2 key={i}>{block.slice(3).trim()}</h2>;
        }

        const lines = block.split("\n").map((l) => l.trim());
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{block}</p>;
      })}
    </>
  );
}
