import Link from 'next/link';

interface NavProps {
  dark?: boolean;
}

export default function Nav({ dark }: NavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <Link href="/" className={`font-display uppercase text-lg ${dark ? 'text-paper' : 'text-ink'}`}>
        FlatMatch
      </Link>
      <div className="hidden sm:flex items-center gap-1 rounded-full bg-ink px-2 py-2">
        <Link
          href="/"
          className="rounded-full px-4 py-1.5 font-mono text-xs text-paper hover:bg-paper hover:text-ink transition-colors"
        >
          Home
        </Link>
        <Link
          href="/create"
          className="rounded-full px-4 py-1.5 font-mono text-xs text-paper hover:bg-paper hover:text-ink transition-colors"
        >
          Start a room
        </Link>
      </div>
      <a
        href="https://github.com/anshullmishra-png/flatmatch"
        target="_blank"
        rel="noreferrer"
        className={`font-mono text-xs underline ${dark ? 'text-paper' : 'text-ink'}`}
      >
        GitHub
      </a>
    </nav>
  );
}
