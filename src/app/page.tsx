import Link from 'next/link';
import Nav from '@/components/Nav';
import Marquee from '@/components/Marquee';

const STEPS = [
  {
    icon: 'ph:clipboard-text-fill',
    chip: 'bg-coral text-cream',
    card: 'bg-cream border-2 border-ink',
    title: 'Fill your must-haves',
    body: 'Before anyone sees a single listing, everyone privately locks in their non-negotiables and their nice-to-haves.',
    checks: ['Budget & areas', 'Lift, parking, pets'],
    checkColor: 'text-coral',
  },
  {
    icon: 'ph:house-simple-fill',
    chip: 'bg-sunny text-ink',
    card: 'bg-ink text-cream md:-translate-y-4',
    title: 'Add listings as you find them',
    body: 'Anyone in the room adds a place with the real fields — rent, area, bedrooms, bathrooms — no copy-pasted walls of text.',
    checks: ['Structured form only', 'Manual commute check'],
    checkColor: 'text-sunny',
  },
  {
    icon: 'ph:scales-fill',
    chip: 'bg-teal text-cream',
    card: 'bg-cream border-2 border-ink',
    title: 'Get a shortlist with trade-offs spelled out',
    body: 'A place that fails anyone’s must-have is excluded, full stop. What’s left gets an honest what-you-get / what-you-give-up per person.',
    checks: ['Deterministic hard filter', 'Per-person breakdown'],
    checkColor: 'text-teal',
  },
];

const GUARDRAILS = [
  { icon: 'ph:shield-check-fill', color: 'text-coral', label: 'Hard filter always wins' },
  { icon: 'ph:key-fill', color: 'text-teal', label: 'No login required' },
  { icon: 'ph:robot-fill', color: 'text-sunny', label: 'AI never scores or picks' },
  { icon: 'ph:arrows-clockwise-bold', color: 'text-coral', label: 'Shortlist recomputes live' },
];

export default function LandingPage() {
  return (
    <main className="bg-cream">
      <Nav />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="blob1 floaty-slow absolute -left-16 -top-10 h-72 w-72 bg-sunny/45" />
          <div className="blob2 floaty absolute -right-10 top-24 h-40 w-40 bg-teal/35" />
          <div className="floaty absolute bottom-10 left-1/3 h-6 w-6 rounded-full bg-coral" />
        </div>

        <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-12 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal/15 px-4 py-2 text-[13px] font-semibold text-teal">
              <iconify-icon icon="ph:hand-waving-fill" width="16" height="16" />A friendlier way to flat-hunt
              together
            </span>

            <h1 className="mt-6 text-[clamp(2.6rem,7vw,5.3rem)] font-extrabold leading-[0.98] tracking-tight">
              Find a flat your whole group can{' '}
              <span className="relative inline-block text-coral">
                smile
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="18"
                  viewBox="0 0 220 18"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M3 13C56 5 165 4 217 9"
                    stroke="#ffc23c"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              about.
            </h1>

            <p className="mt-6 max-w-[30rem] text-[18px] leading-relaxed text-ink/65">
              Everyone locks in their must-haves before anyone sees a listing. When a place clears
              every dealbreaker, you get the trade-offs spelled out plainly — for each person.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-4 font-semibold text-cream shadow-[0_8px_0_0_#23201d] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_0_#23201d]"
              >
                Start a room
                <iconify-icon icon="ph:arrow-up-right-bold" width="18" height="18" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-7 py-4 font-semibold transition-colors hover:bg-sunny"
              >
                <iconify-icon icon="ph:play-circle-fill" width="18" height="18" />
                See how it works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {GUARDRAILS.slice(0, 3).map((g) => (
                <span key={g.label} className="flex items-center gap-2 text-[14px] font-medium text-ink/70">
                  <iconify-icon icon={g.icon} width="18" height="18" className={g.color} />
                  {g.label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="floaty col-span-2 flex h-44 flex-col justify-between rounded-[2rem] bg-teal p-7 text-cream shadow-[0_18px_36px_-14px_rgba(43,182,163,0.65)]">
                <iconify-icon icon="ph:shield-check-fill" width="32" height="32" />
                <div>
                  <p className="text-sm font-semibold text-cream/80">Hard filters</p>
                  <p className="text-2xl font-extrabold">Zero dealbreakers slip through</p>
                </div>
              </div>
              <div className="floaty-slow flex h-44 flex-col justify-between rounded-[2rem] bg-sunny p-7 text-ink">
                <iconify-icon icon="ph:sliders-horizontal-fill" width="32" height="32" />
                <div>
                  <p className="text-sm font-semibold text-ink/60">Scoring</p>
                  <p className="text-2xl font-extrabold">Deterministic, not AI</p>
                </div>
              </div>
              <div className="floaty flex h-44 flex-col justify-between rounded-[2rem] bg-coral p-7 text-cream shadow-[0_18px_36px_-14px_rgba(255,122,89,0.6)]">
                <iconify-icon icon="ph:users-three-fill" width="32" height="32" />
                <div>
                  <p className="text-sm font-semibold text-cream/80">Room size</p>
                  <p className="text-2xl font-extrabold">2–6 people</p>
                </div>
              </div>
            </div>
            <div className="floaty absolute -right-3 -top-7 grid h-24 w-24 rotate-6 place-items-center rounded-full border-2 border-ink bg-cream text-center">
              <span className="text-[13px] font-extrabold leading-tight">
                100%
                <br />
                deterministic
              </span>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      <section id="how-it-works" className="mx-auto max-w-[1180px] px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[14px] font-bold uppercase tracking-[0.18em] text-teal">How it works</span>
          <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold leading-tight tracking-tight">
            Three steps, no drama.
          </h2>
        </div>

        <div className="mt-14 grid items-start gap-7 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.title} className={`card-hover rounded-[2rem] p-8 ${step.card}`}>
              <span className={`grid h-16 w-16 place-items-center rounded-2xl shadow-[0_6px_0_0_#23201d] ${step.chip}`}>
                <iconify-icon icon={step.icon} width="28" height="28" />
              </span>
              <h3 className="mt-6 text-2xl font-extrabold">{step.title}</h3>
              <p className={`mt-3 ${step.card.includes('bg-ink') ? 'text-cream/70' : 'text-ink/65'}`}>{step.body}</p>
              <ul className="mt-5 flex flex-col gap-2">
                {step.checks.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-[14px] font-medium">
                    <iconify-icon icon="ph:check-circle-fill" width="18" height="18" className={step.checkColor} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-center text-[14px] font-semibold text-ink/45">
          The rules that never bend, no matter what
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {GUARDRAILS.map((g) => (
            <span key={g.label} className="flex items-center gap-2 text-xl font-extrabold text-ink/70">
              <iconify-icon icon={g.icon} width="24" height="24" className={g.color} />
              {g.label}
            </span>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-8 lg:pb-32">
        <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[2.5rem] bg-coral px-8 py-16 text-center text-cream lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="blob1 floaty absolute -left-10 -top-10 h-40 w-40 bg-sunny/40" />
            <div className="blob2 floaty-slow absolute -bottom-14 -right-8 h-48 w-48 bg-teal/40" />
          </div>
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/15 px-4 py-2 text-[13px] font-semibold">
              <iconify-icon icon="ph:house-line-fill" width="16" height="16" />
              Free, open source, no signup
            </span>
            <h2 className="mt-6 text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[1.02]">
              Got a group chat that keeps losing flats to dealbreakers?
            </h2>
            <p className="mt-4 text-cream/85">Start a room in ten seconds. No account, no spreadsheet.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-semibold text-cream shadow-[0_8px_0_0_rgba(0,0,0,0.25)] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.25)]"
              >
                Start a room
                <iconify-icon icon="ph:arrow-up-right-bold" width="18" height="18" />
              </Link>
              <a
                href="https://github.com/anshullmishra-png/flatmatch"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cream px-7 py-4 font-semibold text-ink transition-colors hover:bg-sunny"
              >
                <iconify-icon icon="ph:code-fill" width="18" height="18" />
                View the code
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-ink pb-10 pt-16 text-cream">
        <div className="mx-auto grid max-w-[1180px] gap-10 border-b border-cream/10 px-6 pb-12 lg:px-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-coral text-cream">
                <iconify-icon icon="ph:sparkle-fill" width="20" height="20" />
              </span>
              <span className="text-[19px] font-extrabold tracking-tight">FlatMatch</span>
            </div>
            <p className="mt-4 max-w-xs text-cream/60">
              A shared-flat-search coordination tool for small groups. It never picks a flat for you.
            </p>
            <a
              href="https://github.com/anshullmishra-png/flatmatch"
              target="_blank"
              rel="noreferrer"
              className="mt-6 grid h-10 w-10 place-items-center rounded-full bg-cream/10 transition-colors hover:bg-coral"
            >
              <iconify-icon icon="ph:github-logo-fill" width="20" height="20" />
            </a>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="text-[13px] font-bold uppercase tracking-wider text-cream/45">Product</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/" className="text-cream/75 hover:text-coral">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-cream/75 hover:text-coral">
                  Start a room
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="text-cream/75 hover:text-coral">
                  How it works
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[13px] font-bold uppercase tracking-wider text-cream/45">Resources</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href="https://github.com/anshullmishra-png/flatmatch"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cream/75 hover:text-coral"
                >
                  Source on GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/anshullmishra-png/flatmatch/blob/main/supabase-schema.sql"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cream/75 hover:text-coral"
                >
                  Database schema
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 px-6 pt-8 text-[13px] text-cream/45 sm:flex-row lg:px-8">
          <span>© {new Date().getFullYear()} FlatMatch. The tool never picks a flat for you.</span>
        </div>
      </footer>
    </main>
  );
}
