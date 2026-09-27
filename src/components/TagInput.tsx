'use client';

import { useState } from 'react';

interface TagInputProps {
  label: string;
  placeholder: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  validate?: (candidate: string) => string | null;
}

export default function TagInput({ label, placeholder, tags, onChange, validate }: TagInputProps) {
  const [draft, setDraft] = useState('');
  const [liveError, setLiveError] = useState<string | null>(null);

  function update(value: string) {
    setDraft(value);
    setLiveError(validate ? validate(value) : null);
  }

  function commit() {
    const value = draft.trim();
    if (!value) return;
    const error = validate ? validate(value) : null;
    if (error) {
      setLiveError(error);
      return;
    }
    onChange([...tags, value]);
    setDraft('');
    setLiveError(null);
  }

  function remove(index: number) {
    onChange(tags.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono uppercase text-xs">{label}</span>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1 font-mono text-xs"
          >
            {tag}
            <button type="button" onClick={() => remove(i)} aria-label={`Remove ${tag}`}>
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => update(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            }
          }}
          placeholder={placeholder}
          className="flex-1 border-2 border-ink px-4 py-2 font-body focus:outline-none focus:bg-orange/10"
        />
        <button
          type="button"
          onClick={commit}
          className="rounded-full border-2 border-ink px-4 py-2 font-mono text-xs uppercase hover:bg-ink hover:text-paper transition-colors"
        >
          Add
        </button>
      </div>
      {liveError && <p className="font-mono text-xs text-orange">{liveError}</p>}
    </div>
  );
}
