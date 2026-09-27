import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ParticipantBreakdown } from '@/types';

// Claude/Gemini's ONLY job here is to turn already-decided facts into plain
// sentences. It never judges, scores, ranks, or picks a winner — that's all
// decided deterministically in matching.ts before this is ever called.
export async function phraseBreakdown(
  listingTitle: string,
  breakdown: ParticipantBreakdown[]
): Promise<ParticipantBreakdown[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return breakdown; // no key configured — fall back to the raw structured facts
  }

  const payload = breakdown.map((b) => ({
    name: b.participantName,
    preferences_met: b.preferencesMet,
    preferences_missed: b.preferencesMissed,
    all_hard_requirements_passed: true,
  }));

  const prompt = `You are phrasing an already-decided result for a flat-hunting group app called FlatMatch. Do NOT judge, score, rank, or recommend anything — every fact below is already final. For each person in this JSON array, write ONLY 1-2 plain, neutral sentences summarizing what they get (their met preferences) and what they're giving up (their missed preferences), for the listing "${listingTitle}". Everyone already passed their hard requirements, so don't mention pass/fail. Refer to each person by their name only — never guess or use a gendered pronoun ("he", "she") for them. Return strict JSON: an array of {"name": string, "summary": string}, one entry per person, no extra text.

${JSON.stringify(payload, null, 2)}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return breakdown;

    const parsed: { name: string; summary: string }[] = JSON.parse(jsonMatch[0]);
    return breakdown.map((b) => {
      const match = parsed.find((p) => p.name === b.participantName);
      return match ? { ...b, summary: match.summary } : b;
    });
  } catch (err) {
    console.error('Gemini breakdown phrasing failed, falling back to raw facts:', err);
    if (process.env.DEBUG_GEMINI === '1') {
      const message = err instanceof Error ? err.message : String(err);
      return breakdown.map((b) => ({ ...b, summary: `[DEBUG] ${message}` }));
    }
    return breakdown; // AI phrasing is a nice-to-have; never block the shortlist on it
  }
}
