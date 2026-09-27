import Link from 'next/link';
import Nav from '@/components/Nav';
import Marquee from '@/components/Marquee';
import ScrollIndicator from '@/components/ScrollIndicator';

const STEPS = [
  {
    title: 'Fill your must-haves',
    tags: ['Budget', 'Areas', 'Lift', 'Parking', 'Pets'],
    body: 'Before anyone sees a single listing, everyone privately locks in their non-negotiables and their nice-to-haves.',
  },
  {
    title: 'Add listings as you find them',
    tags: ['Structured form', 'No scraping', 'Manual commute check'],
    body: 'Anyone in the room adds a place with the real fields — rent, area, floor, bathrooms — no copy-pasted walls of text.',
  },
  {
    title: 'Get a shortlist with trade-offs spelled out',
    tags: ['Hard filter', 'Deterministic', 'Per-person breakdown'],
    body: 'A place that fails anyone’s must-have is excluded, full stop. What’s left gets an honest what-you-get / what-you-give-up per person.',
  },
];

export default function LandingPage() {
  return (
    <main className="bg-paper">
      <Nav />

      <section className="flex min-h-screen flex-col justify-center px-6 pt-20">
        <h1 className="font-display uppercase text-center leading-[0.85] text-[16vw] tracking-[-0.04em]">
          Flat
          <br />
          Match
        </h1>

        <div className="mt-10 border-t-2 border-ink pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-mono uppercase text-xs tracking-[-0.02em] order-2 sm:order-1">
            Built for flat hunters
          </p>
          <div className="order-1 sm:order-2">
            <ScrollIndicator />
          </div>
          <p className="font-mono uppercase text-xs tracking-[-0.02em] text-right order-3">
            No more group-chat spirals
          </p>
        </div>
      </section>

      <Marquee
        topText="NO MORE GHOSTED LISTINGS —"
        bottomText="FILL IT IN BEFORE YOU FALL IN LOVE WITH A FLAT —"
      />

      <section className="bg-ink py-24">
        <div className="mx-auto max-w-4xl px-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="group border-b border-paper/20 py-10 first:border-t">
              <div className="flex items-start gap-6">
                <span className="font-mono text-orange text-xl shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display uppercase text-paper text-[6vw] sm:text-4xl leading-[0.9] transition-transform group-hover:translate-x-4">
                      {step.title}
                    </h3>
                    <svg
                      className="hidden sm:block h-8 w-8 shrink-0 text-orange opacity-0 rotate-0 transition-all group-hover:opacity-100 group-hover:rotate-45"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="mt-3 max-w-xl font-body text-paper/70">{step.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-paper/30 px-3 py-1 font-mono text-[11px] uppercase text-paper/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-8 py-28 px-6">
        <h2 className="font-display uppercase text-center leading-[0.85] text-[14vw] tracking-[-0.04em]">
          Start a room
        </h2>
        <Link
          href="/create"
          className="rounded-full bg-ink px-10 py-5 font-display uppercase text-paper text-xl transition-transform hover:scale-110"
        >
          Start a Room
        </Link>
      </section>

      <footer className="border-t-2 border-ink px-6 py-6">
        <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs">
          <span>© {new Date().getFullYear()} FlatMatch</span>
          <span>The tool never picks a flat for you.</span>
        </div>
      </footer>
    </main>
  );
}
