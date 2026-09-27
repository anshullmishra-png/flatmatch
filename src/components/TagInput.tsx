'use client';

import { useState } from 'react';
import { normalizeTag } from '@/lib/normalize';

interface TagInputProps {
  label: string;
  placeholder: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  validate?: (candidate: string) => string | null;
  presets?: string[];
}

export default function TagInput({ label, placeholder, tags, onChange, validate, presets }: TagInputProps) {
  const [draft, setDraft] = useState('');
  const [liveError, setLiveError] = useState<string | null>(null);

  function update(value: string) {
    setDraft(value);
    setLiveError(validate ? validate(value) : null);
  }

  function addTag(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const error = validate ? validate(trimmed) : null;
    if (error) {
      setLiveError(error);
      return;
    }
    onChange([...tags, trimmed]);
    setLiveError(null);
  }

  function commit() {
    addTag(draft);
    setDraft('');
  }

  function remove(index: number) {
    onChange(tags.filter((_, i) => i !== index));
  }

  function togglePreset(preset: string) {
    const existingIndex = tags.findIndex((t) => normalizeTag(t) === normalizeTag(preset));
    if (existingIndex >= 0) {
      remove(existingIndex);
    } else {
      addTag(preset);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono uppercase text-xs">{label}</span>

      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => {
            const selected = tags.some((t) => normalizeTag(t) === normalizeTag(preset));
            return (
              <button
                key={preset}
                type="button"
                onClick={() => togglePreset(preset)}
                aria-pressed={selected}
                className={`rounded-full border-2 border-ink px-3 py-1.5 font-mono text-xs uppercase transition-colors ${
                  selected ? 'bg-ink text-paper' : 'bg-transparent text-ink hover:bg-ink/10'
                }`}
              >
                {selected ? '✓ ' : '+ '}
                {preset}
              </button>
            );
          })}
        </div>
      )}

      {tags.filter((tag) => !presets?.some((p) => normalizeTag(p) === normalizeTag(tag))).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) =>
            presets?.some((p) => normalizeTag(p) === normalizeTag(tag)) ? null : (
              <span
                key={`${tag}-${i}`}
                className="flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1 font-mono text-xs"
              >
                {tag}
                <button type="button" onClick={() => remove(i)} aria-label={`Remove ${tag}`}>
                  ×
                </button>
              </span>
            )
          )}
        </div>
      )}

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
