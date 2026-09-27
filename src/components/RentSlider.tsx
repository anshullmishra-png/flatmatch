'use client';

import { stripNegative } from '@/lib/number-input';

interface RentSliderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step: number;
}

export default function RentSlider({ label, value, onChange, min, max, step }: RentSliderProps) {
  const numeric = Number(value) || min;
  const clamped = Math.min(Math.max(numeric, min), max);
  const percent = ((clamped - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">{label}</span>
        <span className="text-2xl font-extrabold text-coral">₹{numeric.toLocaleString('en-IN')}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(e) => onChange(e.target.value)}
        className="h-2 w-full appearance-none rounded-full accent-coral"
        style={{
          background: `linear-gradient(to right, #ff7a59 ${percent}%, rgba(35,32,29,0.12) ${percent}%)`,
        }}
      />
      <div className="flex items-center justify-between text-[12px] font-medium text-ink/45">
        <span>₹{min.toLocaleString('en-IN')}</span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(stripNegative(e.target.value))}
          className="w-28 rounded-full border-2 border-ink/15 px-3 py-1.5 text-right text-[13px] font-semibold text-ink focus:border-coral focus:outline-none"
        />
        <span>₹{max.toLocaleString('en-IN')}+</span>
      </div>
    </div>
  );
}
