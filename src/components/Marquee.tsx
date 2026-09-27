interface MarqueeProps {
  topText: string;
  bottomText: string;
}

export default function Marquee({ topText, bottomText }: MarqueeProps) {
  const row = (text: string) => Array.from({ length: 4 }).map((_, i) => (
    <span key={i} className="mx-6 shrink-0">
      {text}
    </span>
  ));

  return (
    <section className="-skew-y-[2deg] bg-ink py-10 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex font-display uppercase text-orange text-[10vw] leading-none">
          {row(topText)}
        </div>
        <div className="flex font-display uppercase text-orange text-[10vw] leading-none" aria-hidden>
          {row(topText)}
        </div>
      </div>
      <div className="mt-4 flex whitespace-nowrap animate-marquee-reverse">
        <div className="flex font-display uppercase text-paper/80 text-[5vw] leading-none">
          {row(bottomText)}
        </div>
        <div className="flex font-display uppercase text-paper/80 text-[5vw] leading-none" aria-hidden>
          {row(bottomText)}
        </div>
      </div>
    </section>
  );
}
