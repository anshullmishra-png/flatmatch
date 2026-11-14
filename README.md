# FlatMatch

**Helps 2–6 flatmates agree on a flat: everyone's must-haves filter the listings first, so the group only debates trade-offs.**

[![licence: MIT](https://img.shields.io/badge/licence-MIT-blue)](LICENSE)

[Live app](https://flatmatch-three.vercel.app) · Built for Mesa School of Business

**Key decision:** the app never picks a flat. Gemini only turns an already-computed score into plain sentences; it never decides pass or fail or ranks listings.

---


**Core principle:** the app never picks a flat for the group. It captures each person's hard
must-haves and soft preferences before anyone sees a listing, then shows a shortlist where every
listing has already passed everyone's non-negotiables — so the group's conversation is about which
trade-off they want, not whether a place even qualifies.

## Stack

- Next.js (App Router, TypeScript)
- Supabase (Postgres) — no auth; participants are identified by a locally-stored id
- Google Gemini — used only to phrase an already-computed score breakdown into plain sentences;
  it never decides pass/fail or ranks listings
- Deploy target: Vercel

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your own keys
npm run dev
```

The Supabase schema is in [`supabase-schema.sql`](./supabase-schema.sql) — run it against your
project before starting the app.

## How it works

1. **Create a room** — get a shareable code/link, no login required.
2. **Everyone fills their constraints** privately: must-haves (budget, excluded areas, lift,
   parking, bathrooms, pets, commute) and nice-to-haves (free-text tags).
3. **Add listings** as you find them, via a structured form.
4. **View the shortlist** — a listing that fails anyone's hard requirement is excluded outright.
   What's left is ranked by how well it matches everyone's soft preferences, with a clear
   per-person "what you get / what you give up" breakdown.
