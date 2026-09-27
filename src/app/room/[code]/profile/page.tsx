'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import TagInput from '@/components/TagInput';
import { getRoomByCode, getProfile, submitProfile } from '@/lib/actions';
import { getStoredParticipantId } from '@/lib/participant-storage';
import { checkAreaConflict, checkDuplicateTag } from '@/lib/validation';
import type { Participant } from '@/types';

export default function ConstraintsFormPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = params.code.toUpperCase();

  const [me, setMe] = useState<Participant | null | undefined>(undefined);
  const [maxRent, setMaxRent] = useState('');
  const [excludedAreas, setExcludedAreas] = useState<string[]>([]);
  const [needsLift, setNeedsLift] = useState(false);
  const [needsParking, setNeedsParking] = useState(false);
  const [minBathrooms, setMinBathrooms] = useState('');
  const [petFriendlyRequired, setPetFriendlyRequired] = useState(false);
  const [maxCommuteMinutes, setMaxCommuteMinutes] = useState('');
  const [commuteReference, setCommuteReference] = useState('');
  const [softPreferences, setSoftPreferences] = useState<string[]>([]);
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
      if (!participant) return;

      const profile = await getProfile(participant.id);
      if (profile) {
        setMaxRent(String(profile.max_rent));
        setExcludedAreas(profile.excluded_areas);
        setNeedsLift(profile.needs_lift);
        setNeedsParking(profile.needs_parking);
        setMinBathrooms(String(profile.min_bathrooms));
        setPetFriendlyRequired(profile.pet_friendly_required);
        setMaxCommuteMinutes(profile.max_commute_minutes != null ? String(profile.max_commute_minutes) : '');
        setCommuteReference(profile.commute_reference ?? '');
        setSoftPreferences(profile.soft_preferences);
      }
    })();
  }, [code]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!me) return;
    setSaving(true);
    const result = await submitProfile(me.id, {
      maxRent,
      excludedAreas,
      needsLift,
      needsParking,
      minBathrooms,
      petFriendlyRequired,
      maxCommuteMinutes,
      commuteReference,
      softPreferences,
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
          <p className="mt-3 font-body text-ink/70">
            You need to enter your name on the room page before filling this in.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper px-6 pt-28 pb-16">
      <Nav />
      <div className="mx-auto max-w-xl">
        <h1 className="font-display uppercase text-3xl tracking-[-0.04em] leading-[0.9]">Your constraints</h1>
        <p className="mt-2 font-body text-ink/70">
          Filled in privately, before you see any listings. Editing later never deletes listings — the shortlist
          always recomputes live.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-10">
          <section className="border-2 border-ink p-5">
            <h2 className="font-display uppercase text-xl">Must-haves (non-negotiable)</h2>
            <div className="mt-5 flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="font-mono uppercase text-xs">Max rent (₹/month)</span>
                <input
                  type="number"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
                />
                {errors.maxRent && <p className="font-mono text-xs text-orange">{errors.maxRent}</p>}
              </label>

              <TagInput
                label="Excluded areas"
                placeholder="e.g. Kharadi"
                tags={excludedAreas}
                onChange={setExcludedAreas}
                validate={(c) => checkAreaConflict(c, excludedAreas, softPreferences, 'excluded')}
              />

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 font-body">
                  <input type="checkbox" checked={needsLift} onChange={(e) => setNeedsLift(e.target.checked)} />
                  Needs a lift
                </label>
                <label className="flex items-center gap-2 font-body">
                  <input
                    type="checkbox"
                    checked={needsParking}
                    onChange={(e) => setNeedsParking(e.target.checked)}
                  />
                  Needs parking
                </label>
                <label className="flex items-center gap-2 font-body">
                  <input
                    type="checkbox"
                    checked={petFriendlyRequired}
                    onChange={(e) => setPetFriendlyRequired(e.target.checked)}
                  />
                  Must be pet-friendly
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="font-mono uppercase text-xs">Min bathrooms</span>
                <input
                  type="number"
                  value={minBathrooms}
                  onChange={(e) => setMinBathrooms(e.target.value)}
                  className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
                />
                {errors.minBathrooms && <p className="font-mono text-xs text-orange">{errors.minBathrooms}</p>}
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="font-mono uppercase text-xs">Max commute (minutes)</span>
                  <input
                    type="number"
                    value={maxCommuteMinutes}
                    onChange={(e) => setMaxCommuteMinutes(e.target.value)}
                    placeholder="optional"
                    className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
                  />
                  {errors.maxCommuteMinutes && (
                    <p className="font-mono text-xs text-orange">{errors.maxCommuteMinutes}</p>
                  )}
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-mono uppercase text-xs">Commute reference</span>
                  <input
                    value={commuteReference}
                    onChange={(e) => setCommuteReference(e.target.value)}
                    placeholder="e.g. office in Hinjewadi"
                    className="border-2 border-ink px-4 py-3 font-body focus:outline-none focus:bg-orange/10"
                  />
                  {errors.commuteReference && (
                    <p className="font-mono text-xs text-orange">{errors.commuteReference}</p>
                  )}
                </label>
              </div>
            </div>
          </section>

          <section className="border-2 border-ink p-5">
            <h2 className="font-display uppercase text-xl">Nice-to-haves (flexible)</h2>
            <div className="mt-5">
              <TagInput
                label="Soft preferences"
                placeholder="e.g. balcony, furnished, near metro"
                tags={softPreferences}
                onChange={setSoftPreferences}
                validate={(c) =>
                  checkDuplicateTag(c, softPreferences) ??
                  checkAreaConflict(c, excludedAreas, softPreferences, 'preference')
                }
              />
              {errors.softPreferences && (
                <p className="font-mono text-xs text-orange">{errors.softPreferences}</p>
              )}
            </div>
          </section>

          {errors.form && <p className="font-mono text-xs text-orange">{errors.form}</p>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-ink px-8 py-4 font-display uppercase text-paper text-lg transition-transform hover:scale-105 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save my constraints'}
          </button>
        </form>
      </div>
    </main>
  );
}
