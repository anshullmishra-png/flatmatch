'use client';

// Identifies a returning participant on their own browser so they can revisit
// and edit their own submission. There is no login — this is the whole
// identity mechanism, scoped per room code.

function key(roomCode: string): string {
  return `flatmatch:participant:${roomCode.toUpperCase()}`;
}

export function getStoredParticipantId(roomCode: string): string | null {
  try {
    return localStorage.getItem(key(roomCode));
  } catch {
    return null;
  }
}

export function setStoredParticipantId(roomCode: string, participantId: string): void {
  try {
    localStorage.setItem(key(roomCode), participantId);
  } catch {
    // ignore — private browsing / blocked storage, participant just won't be remembered
  }
}
