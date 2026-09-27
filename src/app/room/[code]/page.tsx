'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { getRoomByCode, joinRoom } from '@/lib/actions';
import { getStoredParticipantId, setStoredParticipantId } from '@/lib/participant-storage';
import type { Room, Participant } from '@/types';

type LoadState =
  | { status: 'loading' }
  | { status: 'not_found' }
  | { status: 'ready'; room: Room; participants: Participant[]; me: Participant | null };

export default function RoomHomePage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = params.code.toUpperCase();

  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [nameInput, setNameInput] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  const load = useCallback(async () => {
    const result = await getRoomByCode(code);
    if ('error' in result) {
      setState({ status: 'not_found' });
      return;
    }
    const storedId = getStoredParticipantId(code);
    const me = result.participants.find((p) => p.id === storedId) ?? null;
    setState({ status: 'ready', room: result.room, participants: result.participants, me });
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim()) {
      setJoinError('Enter your name to join the room.');
      return;
    }
    setJoining(true);
    setJoinError(null);
    const result = await joinRoom(code, nameInput);
    setJoining(false);
    if ('error' in result) {
      setJoinError(
        result.error === 'full'
          ? 'This room already has 6 people in it — that’s the max for a shared search.'
          : result.error === 'not_found'
            ? 'Room not found.'
            : 'Enter your name to join the room.'
      );
      return;
    }
    setStoredParticipantId(code, result.participant.id);
    load();
  }

  if (state.status === 'loading') {
    return (
      <main className="min-h-screen bg-paper px-6 pt-28">
        <Nav />
        <p className="font-mono text-sm">Loading room…</p>
      </main>
    );
  }

  if (state.status === 'not_found') {
    return (
      <main className="min-h-screen bg-paper px-6 pt-28 pb-16">
        <Nav />
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-display uppercase text-4xl">Room not found</h1>
          <p className="mt-4 font-body text-ink/70">
            The code &ldquo;{code}&rdquo; doesn&apos;t match any room. Double check the link, or start a new one.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-block rounded-full bg-ink px-8 py-4 font-display uppercase text-paper"
          >
            Start a room
          </Link>
        </div>
      </main>
    );
  }

  const { room, participants, me } = state;

  if (!me) {
    return (
      <main className="min-h-screen bg-paper px-6 pt-28 pb-16">
        <Nav />
        <div className="mx-auto max-w-md">
          <h1 className="font-display uppercase text-4xl tracking-[-0.04em] leading-[0.9]">{room.name}</h1>
          <p className="mt-3 font-mono text-xs uppercase">Room code: {room.code}</p>
          <p className="mt-6 font-body text-ink/70">
            {participants.length > 0
              ? `${participants.map((p) => p.display_name).join(', ')} ${participants.length === 1 ? 'is' : 'are'} already here. Enter your name to join them.`
              : 'Be the first to join this room.'}
          </p>
          <form onSubmit={handleJoin} className="mt-8 flex flex-col gap-4">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
            />
            {joinError && <p className="font-mono text-xs text-orange">{joinError}</p>}
            <button
              type="submit"
              disabled={joining}
              className="rounded-full bg-ink px-8 py-4 font-display uppercase text-paper text-lg transition-transform hover:scale-105 disabled:opacity-50"
            >
              {joining ? 'Joining…' : 'Join room'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const submittedCount = participants.filter((p) => p.has_submitted).length;
  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/room/${room.code}` : '';

  return (
    <main className="min-h-screen bg-paper px-6 pt-28 pb-16">
      <Nav />
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display uppercase text-4xl tracking-[-0.04em] leading-[0.9]">{room.name}</h1>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-2 border-ink px-4 py-3">
          <span className="font-mono uppercase text-xs">Share:</span>
          <code className="font-mono text-sm">{shareLink}</code>
          <button
            onClick={() => navigator.clipboard.writeText(shareLink)}
            className="ml-auto rounded-full border-2 border-ink px-4 py-1.5 font-mono text-xs uppercase hover:bg-ink hover:text-paper transition-colors"
          >
            Copy link
          </button>
        </div>

        <section className="mt-8">
          <h2 className="font-mono uppercase text-xs tracking-[-0.02em]">
            Who&apos;s in ({participants.length}/6)
          </h2>
          <ul className="mt-3 divide-y-2 divide-ink border-2 border-ink">
            {participants.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-3">
                <span className="font-body">
                  {p.display_name}
                  {p.id === me.id && <span className="font-mono text-xs text-ink/50"> (you)</span>}
                </span>
                <span
                  className={`font-mono text-xs uppercase ${p.has_submitted ? 'text-ink' : 'text-ink/40'}`}
                >
                  {p.has_submitted ? 'Submitted' : 'Waiting'}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            href={`/room/${room.code}/profile`}
            className="border-2 border-ink px-5 py-6 text-center font-display uppercase transition-colors hover:bg-ink hover:text-paper"
          >
            {me.has_submitted ? 'Edit your constraints' : 'Fill your constraints'}
          </Link>
          <Link
            href={`/room/${room.code}/listings/new`}
            className="border-2 border-ink px-5 py-6 text-center font-display uppercase transition-colors hover:bg-ink hover:text-paper"
          >
            Add a listing
          </Link>
          {submittedCount >= 2 ? (
            <Link
              href={`/room/${room.code}/shortlist`}
              className="border-2 border-ink bg-orange px-5 py-6 text-center font-display uppercase transition-colors hover:bg-ink hover:text-paper"
            >
              View shortlist
            </Link>
          ) : (
            <div className="border-2 border-ink/30 px-5 py-6 text-center font-display uppercase text-ink/30">
              View shortlist
            </div>
          )}
        </section>
        {submittedCount < 2 && (
          <p className="mt-3 font-mono text-xs text-ink/60">
            Need at least 2 submitted profiles to run a shortlist — {submittedCount}/{participants.length} in so far.
          </p>
        )}
      </div>
    </main>
  );
}
