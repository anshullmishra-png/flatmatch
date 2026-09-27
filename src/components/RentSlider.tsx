'use client';

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
        <span className="font-mono uppercase text-xs">{label}</span>
        <span className="font-display text-2xl">₹{numeric.toLocaleString('en-IN')}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(e) => onChange(e.target.value)}
        className="h-2 w-full appearance-none rounded-full bg-ink/15 accent-orange"
        style={{
          background: `linear-gradient(to right, #FF4D00 ${percent}%, rgba(0,0,0,0.15) ${percent}%)`,
        }}
      />
      <div className="flex items-center justify-between font-mono text-[11px] text-ink/50">
        <span>₹{min.toLocaleString('en-IN')}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 border-2 border-ink px-2 py-1 text-right font-mono text-xs focus:outline-none focus:bg-orange/10"
        />
        <span>₹{max.toLocaleString('en-IN')}+</span>
      </div>
    </div>
  );
}
