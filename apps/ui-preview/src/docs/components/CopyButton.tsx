import { useState } from 'react';

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="ds-copy"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          window.setTimeout(() => {
            setCopied(false);
          }, 1200);
        });
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
