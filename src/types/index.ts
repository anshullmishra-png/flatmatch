export interface Room {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

export interface Participant {
  id: string;
  room_id: string;
  name: string;
  display_name: string;
  has_submitted: boolean;
  created_at: string;
}

export interface Profile {
  participant_id: string;
  max_rent: number;
  excluded_areas: string[];
  needs_lift: boolean;
  needs_parking: boolean;
  min_bedrooms: number;
  min_bathrooms: number;
  pet_friendly_required: boolean;
  max_commute_minutes: number | null;
  commute_reference: string | null;
  soft_preferences: string[];
  updated_at: string;
}

export interface Listing {
  id: string;
  room_id: string;
  added_by_participant_id: string;
  title: string;
  area: string;
  rent: number;
  floor: number;
  has_lift: boolean;
  has_parking: boolean;
  bedrooms: number;
  bathrooms: number;
  pet_friendly: boolean;
  link: string | null;
  commute_ok_for: string[];
  created_at: string;
}

export type ProfileInput = Omit<Profile, 'participant_id' | 'updated_at'>;

export type ListingInput = Omit<
  Listing,
  'id' | 'room_id' | 'added_by_participant_id' | 'created_at'
>;

export interface HardFailure {
  participantId: string;
  participantName: string;
  reason: string;
}

export interface ParticipantBreakdown {
  participantId: string;
  participantName: string;
  preferencesMet: string[];
  preferencesMissed: string[];
  satisfaction: number; // 0..1
  summary?: string; // AI-phrased 1-2 sentences, filled in later
}

export interface ShortlistEntry {
  listing: Listing;
  score: number; // 0..1 average satisfaction across participants
  breakdown: ParticipantBreakdown[];
  isLikelyDuplicate: boolean;
}

export interface NearMiss {
  listing: Listing;
  failures: HardFailure[];
}

export interface MatchResult {
  shortlist: ShortlistEntry[];
  nearMisses: NearMiss[];
}
