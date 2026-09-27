import { normalizeArea, normalizeTag } from './normalize';
import type {
  Listing,
  Participant,
  Profile,
  HardFailure,
  ParticipantBreakdown,
  ShortlistEntry,
  NearMiss,
  MatchResult,
} from '@/types';

interface ParticipantWithProfile {
  participant: Participant;
  profile: Profile;
}

// Step 1: hard filter. Returns the list of failures for one participant
// against one listing — empty array means the listing passes for them.
function hardFailuresFor(listing: Listing, profile: Profile, participantName: string): HardFailure[] {
  const failures: HardFailure[] = [];
  const base = { participantId: profile.participant_id, participantName };

  if (listing.rent > profile.max_rent) {
    failures.push({
      ...base,
      reason: `rent (₹${listing.rent}) is above ${participantName}'s budget of ₹${profile.max_rent}`,
    });
  }

  const excluded = profile.excluded_areas.map(normalizeArea);
  if (excluded.includes(normalizeArea(listing.area))) {
    failures.push({
      ...base,
      reason: `it's in ${listing.area}, which is outside ${participantName}'s approved areas`,
    });
  }

  if (profile.needs_lift && !listing.has_lift) {
    failures.push({ ...base, reason: `no lift, but ${participantName} needs one` });
  }

  if (profile.needs_parking && !listing.has_parking) {
    failures.push({ ...base, reason: `no parking, but ${participantName} needs it` });
  }

  if (listing.bedrooms < profile.min_bedrooms) {
    failures.push({
      ...base,
      reason: `only ${listing.bedrooms} bedroom(s), below ${participantName}'s minimum of ${profile.min_bedrooms}`,
    });
  }

  if (listing.bathrooms < profile.min_bathrooms) {
    failures.push({
      ...base,
      reason: `only ${listing.bathrooms} bathroom(s), below ${participantName}'s minimum of ${profile.min_bathrooms}`,
    });
  }

  if (profile.pet_friendly_required && !listing.pet_friendly) {
    failures.push({ ...base, reason: `not pet-friendly, but ${participantName} requires it` });
  }

  if (profile.max_commute_minutes != null) {
    if (!listing.commute_ok_for.includes(profile.participant_id)) {
      failures.push({
        ...base,
        reason: `commute hasn't been confirmed as OK for ${participantName} (${profile.commute_reference ?? 'their reference point'})`,
      });
    }
  }

  return failures;
}

// Step 2: soft scoring via case-insensitive keyword matching against the
// listing's searchable text (title + area + link).
function softSatisfaction(
  listing: Listing,
  profile: Profile
): { satisfaction: number; met: string[]; missed: string[] } {
  if (profile.soft_preferences.length === 0) {
    return { satisfaction: 1, met: [], missed: [] };
  }

  const haystack = `${listing.title} ${listing.area}`.toLowerCase();
  const met: string[] = [];
  const missed: string[] = [];

  for (const pref of profile.soft_preferences) {
    const key = normalizeTag(pref);
    if (key && haystack.includes(key)) {
      met.push(pref);
    } else {
      missed.push(pref);
    }
  }

  return { satisfaction: met.length / profile.soft_preferences.length, met, missed };
}

function isLikelyDuplicate(listing: Listing, others: Listing[]): boolean {
  return others.some(
    (o) =>
      o.id !== listing.id &&
      normalizeArea(o.area) === normalizeArea(listing.area) &&
      o.rent === listing.rent &&
      o.floor === listing.floor
  );
}

export function runMatchingEngine(
  listings: Listing[],
  participants: ParticipantWithProfile[]
): MatchResult {
  const shortlist: ShortlistEntry[] = [];
  const nearMisses: NearMiss[] = [];

  for (const listing of listings) {
    const allFailures: HardFailure[] = [];
    for (const { participant, profile } of participants) {
      allFailures.push(...hardFailuresFor(listing, profile, participant.display_name));
    }

    if (allFailures.length > 0) {
      nearMisses.push({ listing, failures: allFailures });
      continue;
    }

    const breakdown: ParticipantBreakdown[] = participants.map(({ participant, profile }) => {
      const { satisfaction, met, missed } = softSatisfaction(listing, profile);
      return {
        participantId: participant.id,
        participantName: participant.display_name,
        preferencesMet: met,
        preferencesMissed: missed,
        satisfaction,
      };
    });

    const score =
      breakdown.length === 0
        ? 0
        : breakdown.reduce((sum, b) => sum + b.satisfaction, 0) / breakdown.length;

    shortlist.push({
      listing,
      score,
      breakdown,
      isLikelyDuplicate: isLikelyDuplicate(listing, listings),
    });
  }

  shortlist.sort((a, b) => b.score - a.score);

  return {
    shortlist: shortlist.slice(0, 3),
    nearMisses,
  };
}
