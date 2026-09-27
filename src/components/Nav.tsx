import Link from 'next/link';

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-coral text-cream shadow-[0_6px_0_0_#23201d]">
            <iconify-icon icon="ph:sparkle-fill" width="20" height="20" />
          </span>
          <span className="text-[19px] font-extrabold tracking-tight">
            Flat<span className="text-coral">Match</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 text-[15px] font-medium text-ink/70 md:flex">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <Link href="/create" className="hover:text-ink">
            Start a room
          </Link>
          <a
            href="https://github.com/anshullmishra-png/flatmatch"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            GitHub
          </a>
        </nav>

        <Link
          href="/create"
          className="hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-cream transition-colors hover:bg-coral sm:inline-flex"
        >
          Start a room
          <iconify-icon icon="ph:arrow-up-right-bold" width="16" height="16" />
        </Link>
      </div>
    </header>
  );
}
