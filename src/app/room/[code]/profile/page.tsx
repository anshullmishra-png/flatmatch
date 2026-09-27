'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import TagInput from '@/components/TagInput';
import ToggleChip from '@/components/ToggleChip';
import RentSlider from '@/components/RentSlider';
import { getRoomByCode, getProfile, submitProfile } from '@/lib/actions';
import { getStoredParticipantId } from '@/lib/participant-storage';
import { checkAreaConflict, checkDuplicateTag } from '@/lib/validation';
import { stripNegative } from '@/lib/number-input';
import {
  AREA_PRESETS,
  SOFT_PREFERENCE_PRESETS,
  COMMUTE_PRESETS,
  RENT_SLIDER_MIN,
  RENT_SLIDER_MAX,
  RENT_SLIDER_STEP,
} from '@/lib/presets';
import type { Participant } from '@/types';

export default function ConstraintsFormPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = params.code.toUpperCase();

  const [me, setMe] = useState<Participant | null | undefined>(undefined);
  const [maxRent, setMaxRent] = useState('');
  const [excludedAreas, setExcludedAreas] = useState<string[]>([]);
  const [preferredAreas, setPreferredAreas] = useState<string[]>([]);
  const [needsLift, setNeedsLift] = useState(false);
  const [needsParking, setNeedsParking] = useState(false);
  const [minBedrooms, setMinBedrooms] = useState('');
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
        setPreferredAreas(profile.preferred_areas);
        setNeedsLift(profile.needs_lift);
        setNeedsParking(profile.needs_parking);
        setMinBedrooms(String(profile.min_bedrooms));
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
      preferredAreas,
      needsLift,
      needsParking,
      minBedrooms,
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
          <p className="mt-3 text-ink/65">You need to enter your name on the room page before filling this in.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-6 pb-16 pt-28">
      <Nav />
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-extrabold leading-[0.95] tracking-tight">Your constraints</h1>
        <p className="mt-2 text-ink/65">
          Filled in privately, before you see any listings. Editing later never deletes listings — the shortlist
          always recomputes live.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-10">
          <section className="rounded-[2rem] border-2 border-ink bg-cream p-6">
            <h2 className="text-xl font-extrabold">Must-haves (non-negotiable)</h2>
            <div className="mt-5 flex flex-col gap-6">
              <RentSlider
                label="Max rent (₹/month)"
                value={maxRent}
                onChange={setMaxRent}
                min={RENT_SLIDER_MIN}
                max={RENT_SLIDER_MAX}
                step={RENT_SLIDER_STEP}
              />
              {errors.maxRent && <p className="text-[13px] font-medium text-coral">{errors.maxRent}</p>}

              <TagInput
                label="Excluded areas"
                placeholder="or type a custom area"
                tags={excludedAreas}
                onChange={setExcludedAreas}
                validate={(c) => checkAreaConflict(c, excludedAreas, preferredAreas, 'excluded')}
                presets={AREA_PRESETS}
                accent="coral"
              />

              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">
                  Amenities required
                </span>
                <div className="flex flex-wrap gap-3">
                  <ToggleChip label="Needs a lift" checked={needsLift} onChange={setNeedsLift} />
                  <ToggleChip label="Needs parking" checked={needsParking} onChange={setNeedsParking} />
                  <ToggleChip
                    label="Must be pet-friendly"
                    checked={petFriendlyRequired}
                    onChange={setPetFriendlyRequired}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Min bedrooms</span>
                  <input
                    type="number"
                    min={0}
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(stripNegative(e.target.value))}
                    className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
                  />
                  {errors.minBedrooms && <p className="text-[13px] font-medium text-coral">{errors.minBedrooms}</p>}
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">Min bathrooms</span>
                  <input
                    type="number"
                    min={0}
                    value={minBathrooms}
                    onChange={(e) => setMinBathrooms(stripNegative(e.target.value))}
                    className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
                  />
                  {errors.minBathrooms && (
                    <p className="text-[13px] font-medium text-coral">{errors.minBathrooms}</p>
                  )}
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">
                    Max commute (minutes)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {COMMUTE_PRESETS.map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setMaxCommuteMinutes(String(mins))}
                        aria-pressed={maxCommuteMinutes === String(mins)}
                        className={`rounded-full border-2 px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                          maxCommuteMinutes === String(mins)
                            ? 'border-ink bg-ink text-cream'
                            : 'border-ink/15 bg-cream text-ink/70 hover:border-ink/40'
                        }`}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={maxCommuteMinutes}
                    onChange={(e) => setMaxCommuteMinutes(stripNegative(e.target.value))}
                    placeholder="or type an exact number, optional"
                    className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
                  />
                  {errors.maxCommuteMinutes && (
                    <p className="text-[13px] font-medium text-coral">{errors.maxCommuteMinutes}</p>
                  )}
                </div>
                <label className="flex flex-col gap-2">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-ink/60">
                    Commute reference
                  </span>
                  <input
                    value={commuteReference}
                    onChange={(e) => setCommuteReference(e.target.value)}
                    placeholder="e.g. office in Hinjewadi"
                    className="rounded-2xl border-2 border-ink/15 px-4 py-3 focus:border-coral focus:outline-none"
                  />
                  {errors.commuteReference && (
                    <p className="text-[13px] font-medium text-coral">{errors.commuteReference}</p>
                  )}
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border-2 border-teal/30 bg-teal/10 p-6">
            <h2 className="text-xl font-extrabold">Nice-to-haves (flexible)</h2>
            <div className="mt-5 flex flex-col gap-6">
              <TagInput
                label="Preferred areas"
                placeholder="or type a custom area"
                tags={preferredAreas}
                onChange={setPreferredAreas}
                validate={(c) => checkAreaConflict(c, excludedAreas, preferredAreas, 'preferred')}
                presets={AREA_PRESETS}
                accent="teal"
              />
              {errors.preferredAreas && (
                <p className="text-[13px] font-medium text-coral">{errors.preferredAreas}</p>
              )}

              <TagInput
                label="Soft preferences"
                placeholder="or type a custom preference"
                tags={softPreferences}
                onChange={setSoftPreferences}
                validate={(c) => checkDuplicateTag(c, softPreferences)}
                presets={SOFT_PREFERENCE_PRESETS}
                accent="teal"
              />
              {errors.softPreferences && (
                <p className="text-[13px] font-medium text-coral">{errors.softPreferences}</p>
              )}
            </div>
          </section>

          {errors.form && <p className="text-[13px] font-medium text-coral">{errors.form}</p>}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-8 py-4 text-lg font-semibold text-cream shadow-[0_8px_0_0_#23201d] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_0_#23201d] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save my constraints'}
          </button>
        </form>
      </div>
    </main>
  );
}
