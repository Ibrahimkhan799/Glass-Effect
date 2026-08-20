import { useState } from "react";

export function CodeBlock({
  code,
  label = "Copy",
}: {
  code: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="code-block">
      <button
        type="button"
        className="code-copy"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? "Copied" : label}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
