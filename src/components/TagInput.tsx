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
  accent?: 'coral' | 'teal';
}

export default function TagInput({
  label,
  placeholder,
  tags,
  onChange,
  validate,
  presets,
  accent = 'coral',
}: TagInputProps) {
  const [draft, setDraft] = useState('');
  const [liveError, setLiveError] = useState<string | null>(null);

  const accentBg = accent === 'teal' ? 'bg-teal' : 'bg-coral';
  const accentBorder = accent === 'teal' ? 'focus:border-teal' : 'focus:border-coral';

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
      <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">{label}</span>

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
                className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                  selected
                    ? `border-ink ${accentBg} text-cream`
                    : 'border-ink/15 bg-cream text-ink/70 hover:border-ink/40'
                }`}
              >
                {selected ? (
                  <iconify-icon icon="ph:check-bold" width="13" height="13" />
                ) : (
                  <iconify-icon icon="ph:plus-bold" width="13" height="13" />
                )}
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
                className="flex items-center gap-2 rounded-full border-2 border-ink/15 px-3 py-1.5 text-[13px] font-semibold text-ink"
              >
                {tag}
                <button type="button" onClick={() => remove(i)} aria-label={`Remove ${tag}`}>
                  <iconify-icon icon="ph:x-bold" width="12" height="12" />
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
          className={`flex-1 rounded-full border-2 border-ink/15 px-4 py-2.5 text-[15px] focus:outline-none ${accentBorder}`}
        />
        <button
          type="button"
          onClick={commit}
          className="rounded-full border-2 border-ink bg-cream px-4 py-2 text-[13px] font-semibold uppercase transition-colors hover:bg-ink hover:text-cream"
        >
          Add
        </button>
      </div>
      {liveError && <p className="text-[13px] font-medium text-coral">{liveError}</p>}
    </div>
  );
}
