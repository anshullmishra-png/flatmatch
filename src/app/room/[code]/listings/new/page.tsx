'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { getRoomByCode, getProfile, addListing } from '@/lib/actions';
import { getStoredParticipantId } from '@/lib/participant-storage';
import type { Participant, Profile } from '@/types';

export default function AddListingPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = params.code.toUpperCase();

  const [me, setMe] = useState<Participant | null | undefined>(undefined);
  const [commuteParticipants, setCommuteParticipants] = useState<{ participant: Participant; profile: Profile }[]>(
    []
  );

  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [rent, setRent] = useState('');
  const [floor, setFloor] = useState('0');
  const [bathrooms, setBathrooms] = useState('1');
  const [hasLift, setHasLift] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [link, setLink] = useState('');
  const [commuteOkFor, setCommuteOkFor] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await getRoomByCode(code);
      if ('error' in result) {
        setMe(null);
        return;
      }
      const storedId = getStoredParticipantId(code);
      const participant = result.participants.find((p) => p.id === storedId) ?? null;
      setMe(participant);

      const withCommute: { participant: Participant; profile: Profile }[] = [];
      for (const p of result.participants.filter((p) => p.has_submitted)) {
        const profile = await getProfile(p.id);
        if (profile && profile.max_commute_minutes != null) {
          withCommute.push({ participant: p, profile });
        }
      }
      setCommuteParticipants(withCommute);
    })();
  }, [code]);

  function toggleCommute(participantId: string) {
    setCommuteOkFor((prev) =>
      prev.includes(participantId) ? prev.filter((id) => id !== participantId) : [...prev, participantId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!me) return;
    setSaving(true);
    const result = await addListing(me.room_id, me.id, {
      title,
      area,
      rent,
      floor,
      bathrooms,
      hasLift,
      hasParking,
      petFriendly,
      link,
      commuteOkFor,
    });
    setSaving(false);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    router.push(`/room/${code}`);
  }

  if (me === undefined) {
    return (
      <main className="min-h-screen bg-paper px-6 pt-28">
        <Nav />
        <p className="font-mono text-sm">Loading…</p>
      </main>
    );
  }

  if (!me) {
    return (
      <main className="min-h-screen bg-paper px-6 pt-28 pb-16">
        <Nav />
        <div className="mx-auto max-w-md">
          <h1 className="font-display uppercase text-3xl">Join the room first</h1>
          <p className="mt-3 font-body text-ink/70">You need to join before adding a listing.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-6 pt-28 pb-16">
      <Nav />
      <div className="mx-auto max-w-xl">
        <h1 className="font-display uppercase text-3xl tracking-[-0.04em] leading-[0.9]">Add a listing</h1>
        <p className="mt-2 font-body text-ink/70">
          Structured fields only — no pasted listing text. This keeps the shortlist logic honest.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="font-mono uppercase text-xs">Title / nickname</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2BHK near Baner Rd"
              className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
            />
            {errors.title && <p className="font-mono text-xs text-orange">{errors.title}</p>}
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono uppercase text-xs">Area / locality</span>
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Baner"
              className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
            />
            {errors.area && <p className="font-mono text-xs text-orange">{errors.area}</p>}
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="font-mono uppercase text-xs">Rent (₹/month)</span>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
              />
              {errors.rent && <p className="font-mono text-xs text-orange">{errors.rent}</p>}
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono uppercase text-xs">Floor</span>
              <input
                type="number"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
              />
              {errors.floor && <p className="font-mono text-xs text-orange">{errors.floor}</p>}
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono uppercase text-xs">Bathrooms</span>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
              />
              {errors.bathrooms && <p className="font-mono text-xs text-orange">{errors.bathrooms}</p>}
            </label>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 font-body">
              <input type="checkbox" checked={hasLift} onChange={(e) => setHasLift(e.target.checked)} />
              Has a lift
            </label>
            <label className="flex items-center gap-2 font-body">
              <input type="checkbox" checked={hasParking} onChange={(e) => setHasParking(e.target.checked)} />
              Has parking
            </label>
            <label className="flex items-center gap-2 font-body">
              <input type="checkbox" checked={petFriendly} onChange={(e) => setPetFriendly(e.target.checked)} />
              Pet-friendly
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="font-mono uppercase text-xs">Link (optional)</span>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://…"
              className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
            />
          </label>

          {commuteParticipants.length > 0 && (
            <div className="border-2 border-ink p-5">
              <h2 className="font-mono uppercase text-xs">Commute check</h2>
              <p className="mt-1 font-body text-sm text-ink/70">
                There&apos;s no maps API here — tick the box only if you know this commute genuinely works, based on
                your own knowledge of the area.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {commuteParticipants.map(({ participant, profile }) => (
                  <label key={participant.id} className="flex items-center gap-3 font-body">
                    <input
                      type="checkbox"
                      checked={commuteOkFor.includes(participant.id)}
                      onChange={() => toggleCommute(participant.id)}
                    />
                    Commute OK for {participant.display_name} (≤{profile.max_commute_minutes} min from{' '}
                    {profile.commute_reference})
                  </label>
                ))}
              </div>
            </div>
          )}

          {errors.form && <p className="font-mono text-xs text-orange">{errors.form}</p>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-ink px-8 py-4 font-display uppercase text-paper text-lg transition-transform hover:scale-105 disabled:opacity-50"
          >
            {saving ? 'Adding…' : 'Add listing'}
          </button>
        </form>
      </div>
    </main>
  );
}
