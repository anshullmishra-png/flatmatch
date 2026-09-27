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
    <main className="min-h-screen bg-paper px-6 pt-28 pb-16">
      <Nav />
      <div className="mx-auto max-w-md">
        <h1 className="font-display uppercase text-4xl tracking-[-0.04em] leading-[0.9]">Start a room</h1>
        <p className="mt-3 font-body text-ink/70">
          Give it a name, tell us who you are, and you&apos;ll get a shareable code for the rest of the group.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="font-mono uppercase text-xs">Room name (optional)</span>
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Baner flat hunt"
              className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono uppercase text-xs">Your name</span>
            <input
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="e.g. Priya"
              className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
              required
            />
          </label>

          {error && <p className="font-mono text-xs text-orange">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-ink px-8 py-4 font-display uppercase text-paper text-lg transition-transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create room'}
          </button>
        </form>
      </div>
    </main>
  );
}
