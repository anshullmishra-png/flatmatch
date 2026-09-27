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
        <Nav dark />
        <p className="font-mono text-sm text-paper">Running the match…</p>
      </main>
    );
  }

  if (state.status === 'not_found') {
    return (
      <main className="min-h-screen bg-paper px-6 pt-28 pb-16">
        <Nav />
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-display uppercase text-4xl">Room not found</h1>
        </div>
      </main>
    );
  }

  if (state.status === 'not_enough') {
    return (
      <main className="min-h-screen bg-paper px-6 pt-28 pb-16">
        <Nav />
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-display uppercase text-3xl">Not enough profiles yet</h1>
          <p className="mt-4 font-body text-ink/70">
            {state.submittedCount}/{state.totalCount} people have submitted their constraints. You need at least 2
            before a shortlist means anything.
          </p>
          <Link
            href={`/room/${code}`}
            className="mt-8 inline-block rounded-full bg-ink px-8 py-4 font-display uppercase text-paper"
          >
            Back to room
          </Link>
        </div>
      </main>
    );
  }

  const { result } = state;

  return (
    <main className="min-h-screen bg-ink pb-24">
      <Nav dark />
      <div className="px-6 pt-28">
        <h1 className="font-display uppercase text-paper text-[12vw] sm:text-7xl tracking-[-0.04em] leading-[0.85]">
          Shortlist
        </h1>
      </div>

      <div className="mx-auto max-w-4xl px-6 mt-10">
        {result.shortlist.length > 0 ? (
          result.shortlist.map((entry, i) => <ShortlistCard key={entry.listing.id} index={i} entry={entry} />)
        ) : (
          <p className="font-body text-paper/70">
            Nothing has cleared every must-have yet. Here&apos;s exactly why each listing didn&apos;t make it:
          </p>
        )}

        {result.nearMisses.length > 0 && (
          <div className="mt-12">
            <h2 className="font-mono uppercase text-xs text-paper/50">
              {result.shortlist.length > 0 ? 'Didn’t make the cut' : 'Why nothing qualified'}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {result.nearMisses.map((miss) => (
                <div key={miss.listing.id} className="border border-paper/20 p-4">
                  <p className="font-mono uppercase text-sm text-paper">{miss.listing.title}</p>
                  <ul className="mt-2 flex flex-col gap-1">
                    {miss.failures.map((f, i) => (
                      <li key={i} className="font-body text-sm text-paper/70">
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
            className="rounded-full bg-paper px-8 py-4 font-display uppercase text-ink text-lg transition-transform hover:scale-105 inline-block"
          >
            Back to room
          </Link>
        </div>
      </div>
    </main>
  );
}
