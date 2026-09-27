'use client';

interface ToggleChipProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function ToggleChip({ label, checked, onChange }: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[14px] font-semibold transition-colors ${
        checked
          ? 'border-ink bg-ink text-cream'
          : 'border-ink/15 bg-cream text-ink/70 hover:border-ink/40'
      }`}
    >
      {checked && <iconify-icon icon="ph:check-bold" width="14" height="14" />}
      {label}
    </button>
  );
}
