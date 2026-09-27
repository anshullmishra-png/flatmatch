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
      <main className="min-h-screen bg-cream px-6 pt-28">
        <Nav />
        <p className="text-ink/60">Loading room…</p>
      </main>
    );
  }

  if (state.status === 'not_found') {
    return (
      <main className="min-h-screen bg-cream px-6 pb-16 pt-28">
        <Nav />
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Room not found</h1>
          <p className="mt-4 text-ink/65">
            The code &ldquo;{code}&rdquo; doesn&apos;t match any room. Double check the link, or start a new one.
          </p>
          <Link
            href="/create"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral px-8 py-4 font-semibold text-cream shadow-[0_8px_0_0_#23201d] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_0_#23201d]"
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
      <main className="min-h-screen bg-cream px-6 pb-16 pt-28">
        <Nav />
        <div className="mx-auto max-w-md">
          <h1 className="text-4xl font-extrabold leading-[0.95] tracking-tight">{room.name}</h1>
          <p className="mt-3 text-[13px] font-bold uppercase tracking-wide text-teal">Room code: {room.code}</p>
          <p className="mt-6 text-ink/65">
            {participants.length > 0
              ? `${participants.map((p) => p.display_name).join(', ')} ${participants.length === 1 ? 'is' : 'are'} already here. Enter your name to join them.`
              : 'Be the first to join this room.'}
          </p>
          <form onSubmit={handleJoin} className="mt-8 flex flex-col gap-4">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
            />
            {joinError && <p className="text-[13px] font-medium text-coral">{joinError}</p>}
            <button
              type="submit"
              disabled={joining}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 text-lg font-semibold text-cream shadow-[0_8px_0_0_#23201d] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_0_#23201d] disabled:opacity-50"
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
    <main className="min-h-screen bg-cream px-6 pb-16 pt-28">
      <Nav />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-extrabold leading-[0.95] tracking-tight">{room.name}</h1>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-ink/15 px-4 py-3">
          <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Share:</span>
          <code className="text-sm">{shareLink}</code>
          <button
            onClick={() => navigator.clipboard.writeText(shareLink)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-4 py-1.5 text-[13px] font-semibold uppercase transition-colors hover:bg-ink hover:text-cream"
          >
            <iconify-icon icon="ph:link-bold" width="14" height="14" />
            Copy link
          </button>
        </div>

        <section className="mt-8">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink/60">
            Who&apos;s in ({participants.length}/6)
          </h2>
          <ul className="mt-3 divide-y-2 divide-ink/10 rounded-2xl border-2 border-ink/15">
            {participants.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-3">
                <span>
                  {p.display_name}
                  {p.id === me.id && <span className="text-sm text-ink/45"> (you)</span>}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase ${
                    p.has_submitted ? 'text-teal' : 'text-ink/40'
                  }`}
                >
                  <iconify-icon
                    icon={p.has_submitted ? 'ph:check-circle-fill' : 'ph:clock-fill'}
                    width="16"
                    height="16"
                  />
                  {p.has_submitted ? 'Submitted' : 'Waiting'}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            href={`/room/${room.code}/profile`}
            className="card-hover rounded-[2rem] border-2 border-ink bg-cream px-5 py-6 text-center font-semibold transition-colors hover:bg-ink hover:text-cream"
          >
            {me.has_submitted ? 'Edit your constraints' : 'Fill your constraints'}
          </Link>
          <Link
            href={`/room/${room.code}/listings/new`}
            className="card-hover rounded-[2rem] border-2 border-ink bg-cream px-5 py-6 text-center font-semibold transition-colors hover:bg-ink hover:text-cream"
          >
            Add a listing
          </Link>
          {submittedCount >= 2 ? (
            <Link
              href={`/room/${room.code}/shortlist`}
              className="card-hover rounded-[2rem] border-2 border-ink bg-coral px-5 py-6 text-center font-semibold text-cream transition-colors hover:bg-ink"
            >
              View shortlist
            </Link>
          ) : (
            <div className="rounded-[2rem] border-2 border-ink/15 px-5 py-6 text-center font-semibold text-ink/30">
              View shortlist
            </div>
          )}
        </section>
        {submittedCount < 2 && (
          <p className="mt-3 text-[13px] text-ink/50">
            Need at least 2 submitted profiles to run a shortlist — {submittedCount}/{participants.length} in so far.
          </p>
        )}
      </div>
    </main>
  );
}
