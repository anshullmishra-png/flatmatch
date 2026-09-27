'use client';

import { useState } from 'react';
import type { ShortlistEntry } from '@/types';

interface ShortlistCardProps {
  index: number;
  entry: ShortlistEntry;
}

const CHIP_COLORS = ['bg-teal', 'bg-sunny', 'bg-coral'];

export default function ShortlistCard({ index, entry }: ShortlistCardProps) {
  const [open, setOpen] = useState(index === 0);
  const { listing, score, breakdown, isLikelyDuplicate } = entry;
  const chipColor = CHIP_COLORS[index % CHIP_COLORS.length];

  return (
    <div className="border-b border-cream/10 py-8 first:border-t">
      <button type="button" onClick={() => setOpen((o) => !o)} className="group w-full text-left">
        <div className="flex items-start gap-6">
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-cream ${chipColor}`}
          >
            {index + 1}
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[7vw] font-extrabold leading-[0.95] tracking-tight transition-transform group-hover:translate-x-3 sm:text-3xl">
                {listing.title}
              </h3>
              <iconify-icon
                icon="ph:plus-circle-fill"
                width="28"
                height="28"
                className={`hidden shrink-0 text-sunny transition-transform sm:block ${open ? 'rotate-45' : ''}`}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-cream/10 px-3 py-1 text-[12px] font-semibold uppercase text-cream/80">
                {listing.area}
              </span>
              <span className="rounded-full bg-cream/10 px-3 py-1 text-[12px] font-semibold uppercase text-cream/80">
                ₹{listing.rent}/mo
              </span>
              <span className="rounded-full bg-cream/10 px-3 py-1 text-[12px] font-semibold uppercase text-cream/80">
                Floor {listing.floor} · {listing.bedrooms} bed · {listing.bathrooms} bath
              </span>
              <span className="rounded-full bg-sunny px-3 py-1 text-[12px] font-extrabold uppercase text-ink">
                {Math.round(score * 100)}% match
              </span>
              {isLikelyDuplicate && (
                <span className="rounded-full bg-cream/10 px-3 py-1 text-[12px] font-semibold uppercase text-cream/50">
                  Possible duplicate
                </span>
              )}
              {listing.link && (
                <a
                  href={listing.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full bg-cream/10 px-3 py-1 text-[12px] font-semibold uppercase text-cream/80 underline"
                >
                  Original listing
                </a>
              )}
            </div>
          </div>
        </div>
      </button>

      {open && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {breakdown.map((b) => (
            <div key={b.participantId} className="rounded-[1.5rem] border border-cream/15 p-4">
              <p className="text-[13px] font-bold uppercase tracking-wide text-sunny">{b.participantName}</p>
              {b.summary ? (
                <p className="mt-2 text-cream/90">{b.summary}</p>
              ) : (
                <div className="mt-2 flex flex-col gap-2">
                  <p className="text-cream/90">
                    <span className="text-cream/50">Gets: </span>
                    {b.preferencesMet.length > 0 ? b.preferencesMet.join(', ') : 'no specific soft preferences matched'}
                  </p>
                  <p className="text-cream/90">
                    <span className="text-cream/50">Gives up: </span>
                    {b.preferencesMissed.length > 0 ? b.preferencesMissed.join(', ') : 'nothing they asked for'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
