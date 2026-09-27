'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { createRoom, joinRoom } from '@/lib/actions';
import { setStoredParticipantId } from '@/lib/participant-storage';

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState('');
  const [yourName, setYourName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!yourName.trim()) {
      setError('Enter your name so we know who you are in the room.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { room } = await createRoom(roomName);
      const result = await joinRoom(room.code, yourName);
      if ('error' in result) {
        setError('Could not join the room you just created — try again.');
        setLoading(false);
        return;
      }
      setStoredParticipantId(room.code, result.participant.id);
      router.push(`/room/${room.code}`);
    } catch {
      setError('Something went wrong creating the room. Try again.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-6 pb-16 pt-28">
      <Nav />
      <div className="mx-auto max-w-md">
        <span className="inline-flex items-center gap-2 rounded-full bg-teal/15 px-4 py-2 text-[13px] font-semibold text-teal">
          <iconify-icon icon="ph:door-open-fill" width="16" height="16" />
          New room
        </span>
        <h1 className="mt-4 text-4xl font-extrabold leading-[0.95] tracking-tight">Start a room</h1>
        <p className="mt-3 text-ink/65">
          Give it a name, tell us who you are, and you&apos;ll get a shareable code for the rest of the group.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Room name (optional)</span>
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Baner flat hunt"
              className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Your name</span>
            <input
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="e.g. Priya"
              className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
              required
            />
          </label>

          {error && <p className="text-[13px] font-medium text-coral">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 text-lg font-semibold text-cream shadow-[0_8px_0_0_#23201d] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_0_#23201d] disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create room'}
          </button>
        </form>
      </div>
    </main>
  );
}
