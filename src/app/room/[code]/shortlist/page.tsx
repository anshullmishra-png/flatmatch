'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav';
import ShortlistCard from '@/components/ShortlistCard';
import { getRoomByCode, computeShortlist } from '@/lib/actions';
import type { MatchResult } from '@/types';

type LoadState =
  | { status: 'loading' }
  | { status: 'not_found' }
  | { status: 'not_enough'; submittedCount: number; totalCount: number }
  | { status: 'ready'; code: string; result: MatchResult };

export default function ShortlistPage() {
  const params = useParams<{ code: string }>();
  const code = params.code.toUpperCase();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    (async () => {
      const room = await getRoomByCode(code);
      if ('error' in room) {
        setState({ status: 'not_found' });
        return;
      }
      const result = await computeShortlist(room.room.id);
      if ('error' in result) {
        setState({ status: 'not_enough', submittedCount: result.submittedCount, totalCount: result.totalCount });
        return;
      }
      setState({ status: 'ready', code, result });
    })();
  }, [code]);

  if (state.status === 'loading') {
    return (
      <main className="min-h-screen bg-ink px-6 pt-28">
        <Nav />
        <p className="text-cream/70">Running the match…</p>
      </main>
    );
  }

  if (state.status === 'not_found') {
    return (
      <main className="min-h-screen bg-cream px-6 pb-16 pt-28">
        <Nav />
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Room not found</h1>
        </div>
      </main>
    );
  }

  if (state.status === 'not_enough') {
    return (
      <main className="min-h-screen bg-cream px-6 pb-16 pt-28">
        <Nav />
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Not enough profiles yet</h1>
          <p className="mt-4 text-ink/65">
            {state.submittedCount}/{state.totalCount} people have submitted their constraints. You need at least 2
            before a shortlist means anything.
          </p>
          <Link
            href={`/room/${code}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral px-8 py-4 font-semibold text-cream shadow-[0_8px_0_0_#23201d] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_0_#23201d]"
          >
            Back to room
          </Link>
        </div>
      </main>
    );
  }

  const { result } = state;

  return (
    <main className="min-h-screen bg-ink pb-24 text-cream">
      <Nav />
      <div className="px-6 pt-28">
        <span className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 text-[13px] font-semibold text-sunny">
          <iconify-icon icon="ph:scales-fill" width="16" height="16" />
          The hard filter always wins
        </span>
        <h1 className="mt-4 text-[12vw] font-extrabold leading-[0.85] tracking-tight sm:text-7xl">Shortlist</h1>
      </div>

      <div className="mx-auto mt-10 max-w-4xl px-6">
        {result.shortlist.length > 0 ? (
          result.shortlist.map((entry, i) => <ShortlistCard key={entry.listing.id} index={i} entry={entry} />)
        ) : (
          <p className="text-cream/70">
            Nothing has cleared every must-have yet. Here&apos;s exactly why each listing didn&apos;t make it:
          </p>
        )}

        {result.nearMisses.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-cream/50">
              {result.shortlist.length > 0 ? 'Didn’t make the cut' : 'Why nothing qualified'}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {result.nearMisses.map((miss) => (
                <div key={miss.listing.id} className="rounded-[1.5rem] border border-cream/15 p-4">
                  <p className="text-sm font-bold uppercase text-cream">{miss.listing.title}</p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {miss.failures.map((f, i) => (
                      <li key={i} className="text-sm text-cream/70">
                        Excluded because {f.reason}.
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14">
          <Link
            href={`/room/${code}`}
            className="inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-lg font-semibold text-ink shadow-[0_8px_0_0_rgba(253,249,243,0.25)] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_0_rgba(253,249,243,0.25)]"
          >
            Back to room
          </Link>
        </div>
      </div>
    </main>
  );
}
