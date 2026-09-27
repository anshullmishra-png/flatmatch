'use server';

import { supabaseServer } from './supabase/server';
import { generateRoomCode } from './room-code';
import { dedupeNormalized } from './normalize';
import { validateProfile, validateListing, type ProfileFormData, type ListingFormData } from './validation';
import { runMatchingEngine } from './matching';
import { phraseBreakdown } from './gemini';
import type { Room, Participant, Profile, Listing, MatchResult } from '@/types';

const MAX_PARTICIPANTS = 6;

export async function createRoom(name: string): Promise<{ room: Room }> {
  const db = supabaseServer();

  let code = generateRoomCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await db.from('rooms').select('id').eq('code', code).maybeSingle();
    if (!existing) break;
    code = generateRoomCode();
  }

  const { data, error } = await db
    .from('rooms')
    .insert({ code, name: name.trim() || 'Our flat search' })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { room: data as Room };
}

export async function getRoomByCode(
  code: string
): Promise<{ room: Room; participants: Participant[] } | { error: 'not_found' }> {
  const db = supabaseServer();
  const { data: room } = await db.from('rooms').select('*').eq('code', code.toUpperCase()).maybeSingle();
  if (!room) return { error: 'not_found' };

  const { data: participants } = await db
    .from('participants')
    .select('*')
    .eq('room_id', room.id)
    .order('created_at', { ascending: true });

  return { room: room as Room, participants: (participants ?? []) as Participant[] };
}

export async function joinRoom(
  code: string,
  name: string
): Promise<{ participant: Participant } | { error: 'not_found' | 'full' | 'invalid_name' }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: 'invalid_name' };

  const db = supabaseServer();
  const { data: room } = await db.from('rooms').select('*').eq('code', code.toUpperCase()).maybeSingle();
  if (!room) return { error: 'not_found' };

  const { data: participants } = await db
    .from('participants')
    .select('*')
    .eq('room_id', room.id)
    .order('created_at', { ascending: true });

  const existing = (participants ?? []) as Participant[];
  if (existing.length >= MAX_PARTICIPANTS) return { error: 'full' };

  const sameName = existing.filter((p) => p.name.toLowerCase() === trimmed.toLowerCase());
  const displayName = sameName.length > 0 ? `${trimmed} (${sameName.length + 1})` : trimmed;

  const { data, error } = await db
    .from('participants')
    .insert({ room_id: room.id, name: trimmed, display_name: displayName })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { participant: data as Participant };
}

export async function getParticipant(participantId: string): Promise<Participant | null> {
  const db = supabaseServer();
  const { data } = await db.from('participants').select('*').eq('id', participantId).maybeSingle();
  return (data as Participant) ?? null;
}

export async function getProfile(participantId: string): Promise<Profile | null> {
  const db = supabaseServer();
  const { data } = await db.from('profiles').select('*').eq('participant_id', participantId).maybeSingle();
  return (data as Profile) ?? null;
}

export async function submitProfile(
  participantId: string,
  input: ProfileFormData
): Promise<{ ok: true } | { ok: false; errors: Record<string, string> }> {
  const errors = validateProfile(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const db = supabaseServer();

  const excludedAreas = dedupeNormalized(input.excludedAreas).map((a) => a.trim());
  const softPreferences = dedupeNormalized(input.softPreferences).map((p) => p.trim());
  const hasCommute =
    input.maxCommuteMinutes !== '' && input.maxCommuteMinutes !== null && input.commuteReference.trim() !== '';

  const { error } = await db.from('profiles').upsert({
    participant_id: participantId,
    max_rent: Number(input.maxRent),
    excluded_areas: excludedAreas,
    needs_lift: input.needsLift,
    needs_parking: input.needsParking,
    min_bathrooms: input.minBathrooms === '' ? 0 : Number(input.minBathrooms),
    pet_friendly_required: input.petFriendlyRequired,
    max_commute_minutes: hasCommute ? Number(input.maxCommuteMinutes) : null,
    commute_reference: hasCommute ? input.commuteReference.trim() : null,
    soft_preferences: softPreferences,
    updated_at: new Date().toISOString(),
  });

  if (error) return { ok: false, errors: { form: error.message } };

  await db.from('participants').update({ has_submitted: true }).eq('id', participantId);

  return { ok: true };
}

export async function getListings(roomId: string): Promise<Listing[]> {
  const db = supabaseServer();
  const { data } = await db
    .from('listings')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false });
  return (data ?? []) as Listing[];
}

export async function addListing(
  roomId: string,
  addedByParticipantId: string,
  input: ListingFormData & { hasLift: boolean; hasParking: boolean; petFriendly: boolean; link: string; commuteOkFor: string[] }
): Promise<{ ok: true } | { ok: false; errors: Record<string, string> }> {
  const errors = validateListing(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const db = supabaseServer();
  const { error } = await db.from('listings').insert({
    room_id: roomId,
    added_by_participant_id: addedByParticipantId,
    title: input.title.trim(),
    area: input.area.trim(),
    rent: Number(input.rent),
    floor: Number(input.floor),
    bathrooms: Number(input.bathrooms),
    has_lift: input.hasLift,
    has_parking: input.hasParking,
    pet_friendly: input.petFriendly,
    link: input.link.trim() || null,
    commute_ok_for: input.commuteOkFor,
  });

  if (error) return { ok: false, errors: { form: error.message } };
  return { ok: true };
}

export async function computeShortlist(
  roomId: string
): Promise<MatchResult | { error: 'not_enough_participants'; submittedCount: number; totalCount: number }> {
  const db = supabaseServer();

  const { data: participants } = await db
    .from('participants')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  const allParticipants = (participants ?? []) as Participant[];
  const submitted = allParticipants.filter((p) => p.has_submitted);

  if (submitted.length < 2) {
    return {
      error: 'not_enough_participants',
      submittedCount: submitted.length,
      totalCount: allParticipants.length,
    };
  }

  const { data: profiles } = await db
    .from('profiles')
    .select('*')
    .in(
      'participant_id',
      submitted.map((p) => p.id)
    );

  const profileByParticipant = new Map((profiles ?? []).map((p: Profile) => [p.participant_id, p]));

  const participantsWithProfile = submitted
    .map((participant) => {
      const profile = profileByParticipant.get(participant.id);
      return profile ? { participant, profile } : null;
    })
    .filter((p): p is { participant: Participant; profile: Profile } => p !== null);

  const { data: listingsData } = await db
    .from('listings')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false });

  const listings = (listingsData ?? []) as Listing[];

  const result = runMatchingEngine(listings, participantsWithProfile);

  for (const entry of result.shortlist) {
    entry.breakdown = await phraseBreakdown(entry.listing.title, entry.breakdown);
  }

  return result;
}
