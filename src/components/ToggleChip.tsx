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
      className={`rounded-full border-2 border-ink px-4 py-2 font-mono text-xs uppercase transition-colors ${
        checked ? 'bg-ink text-paper' : 'bg-transparent text-ink hover:bg-ink/10'
      }`}
    >
      {checked ? '✓ ' : ''}
      {label}
    </button>
  );
}
