'use client';

import { useState } from 'react';
import type { ShortlistEntry } from '@/types';

interface ShortlistCardProps {
  index: number;
  entry: ShortlistEntry;
}

export default function ShortlistCard({ index, entry }: ShortlistCardProps) {
  const [open, setOpen] = useState(index === 0);
  const { listing, score, breakdown, isLikelyDuplicate } = entry;

  return (
    <div className="border-b border-paper/20 py-8 first:border-t">
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full text-left group">
        <div className="flex items-start gap-6">
          <span className="font-mono text-orange text-xl shrink-0">{String(index + 1).padStart(2, '0')}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display uppercase text-paper text-[7vw] sm:text-4xl leading-[0.9] transition-transform group-hover:translate-x-4">
                {listing.title}
              </h3>
              <svg
                className={`hidden sm:block h-8 w-8 shrink-0 text-orange transition-transform ${open ? 'rotate-45' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-paper/30 px-3 py-1 font-mono text-[11px] uppercase text-paper/80">
                {listing.area}
              </span>
              <span className="rounded-full border border-paper/30 px-3 py-1 font-mono text-[11px] uppercase text-paper/80">
                ₹{listing.rent}/mo
              </span>
              <span className="rounded-full border border-paper/30 px-3 py-1 font-mono text-[11px] uppercase text-paper/80">
                Floor {listing.floor} · {listing.bathrooms} bath
              </span>
              <span className="rounded-full border border-orange px-3 py-1 font-mono text-[11px] uppercase text-orange">
                {Math.round(score * 100)}% match
              </span>
              {isLikelyDuplicate && (
                <span className="rounded-full border border-paper/30 px-3 py-1 font-mono text-[11px] uppercase text-paper/50">
                  Possible duplicate
                </span>
              )}
              {listing.link && (
                <a
                  href={listing.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full border border-paper/30 px-3 py-1 font-mono text-[11px] uppercase text-paper/80 underline"
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
            <div key={b.participantId} className="border border-paper/20 p-4">
              <p className="font-mono uppercase text-xs text-orange">{b.participantName}</p>
              {b.summary ? (
                <p className="mt-2 font-body text-paper/90">{b.summary}</p>
              ) : (
                <div className="mt-2 flex flex-col gap-2">
                  <p className="font-body text-paper/90">
                    <span className="text-paper/50">Gets: </span>
                    {b.preferencesMet.length > 0 ? b.preferencesMet.join(', ') : 'no specific soft preferences matched'}
                  </p>
                  <p className="font-body text-paper/90">
                    <span className="text-paper/50">Gives up: </span>
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
