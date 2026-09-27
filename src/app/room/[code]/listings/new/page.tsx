'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import ToggleChip from '@/components/ToggleChip';
import { getRoomByCode, getProfile, addListing } from '@/lib/actions';
import { getStoredParticipantId } from '@/lib/participant-storage';
import { stripNegative } from '@/lib/number-input';
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
  const [bedrooms, setBedrooms] = useState('1');
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
      bedrooms,
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
      <main className="min-h-screen bg-cream px-6 pt-28">
        <Nav />
        <p className="text-ink/60">Loading…</p>
      </main>
    );
  }

  if (!me) {
    return (
      <main className="min-h-screen bg-cream px-6 pb-16 pt-28">
        <Nav />
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight">Join the room first</h1>
          <p className="mt-3 text-ink/65">You need to join before adding a listing.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-6 pb-16 pt-28">
      <Nav />
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-extrabold leading-[0.95] tracking-tight">Add a listing</h1>
        <p className="mt-2 text-ink/65">
          Structured fields only — no pasted listing text. This keeps the shortlist logic honest.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Title / nickname</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2BHK near Baner Rd"
              className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
            />
            {errors.title && <p className="text-[13px] font-medium text-coral">{errors.title}</p>}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Area / locality</span>
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Baner"
              className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
            />
            {errors.area && <p className="text-[13px] font-medium text-coral">{errors.area}</p>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Rent (₹/month)</span>
              <input
                type="number"
                min={0}
                value={rent}
                onChange={(e) => setRent(stripNegative(e.target.value))}
                className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
              />
              {errors.rent && <p className="text-[13px] font-medium text-coral">{errors.rent}</p>}
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Floor</span>
              <input
                type="number"
                min={0}
                value={floor}
                onChange={(e) => setFloor(stripNegative(e.target.value))}
                className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
              />
              {errors.floor && <p className="text-[13px] font-medium text-coral">{errors.floor}</p>}
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Bedrooms</span>
              <input
                type="number"
                min={0}
                value={bedrooms}
                onChange={(e) => setBedrooms(stripNegative(e.target.value))}
                className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
              />
              {errors.bedrooms && <p className="text-[13px] font-medium text-coral">{errors.bedrooms}</p>}
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Bathrooms</span>
              <input
                type="number"
                min={0}
                value={bathrooms}
                onChange={(e) => setBathrooms(stripNegative(e.target.value))}
                className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
              />
              {errors.bathrooms && <p className="text-[13px] font-medium text-coral">{errors.bathrooms}</p>}
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <ToggleChip label="Has a lift" checked={hasLift} onChange={setHasLift} />
            <ToggleChip label="Has parking" checked={hasParking} onChange={setHasParking} />
            <ToggleChip label="Pet-friendly" checked={petFriendly} onChange={setPetFriendly} />
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Link (optional)</span>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://…"
              className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
            />
          </label>

          {commuteParticipants.length > 0 && (
            <div className="rounded-[2rem] border-2 border-teal/30 bg-teal/10 p-5">
              <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Commute check</h2>
              <p className="mt-1 text-sm text-ink/65">
                There&apos;s no maps API here — tick the box only if you know this commute genuinely works, based on
                your own knowledge of the area.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {commuteParticipants.map(({ participant, profile }) => (
                  <label key={participant.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={commuteOkFor.includes(participant.id)}
                      onChange={() => toggleCommute(participant.id)}
                      className="h-4 w-4 accent-teal"
                    />
                    Commute OK for {participant.display_name} (≤{profile.max_commute_minutes} min from{' '}
                    {profile.commute_reference})
                  </label>
                ))}
              </div>
            </div>
          )}

          {errors.form && <p className="text-[13px] font-medium text-coral">{errors.form}</p>}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 text-lg font-semibold text-cream shadow-[0_8px_0_0_#23201d] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_0_#23201d] disabled:opacity-50"
          >
            {saving ? 'Adding…' : 'Add listing'}
          </button>
        </form>
      </div>
    </main>
  );
}
