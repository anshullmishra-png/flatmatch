const WORDS = [
  { text: 'Must-haves', stroke: false },
  { text: 'Nice-to-haves', stroke: true },
  { text: 'Hard filters', stroke: false },
  { text: 'Shortlists', stroke: true },
  { text: 'No ghosting', stroke: false },
];

const ASTERISK_COLORS = ['text-sunny', 'text-coral', 'text-teal'];

function WordGroup({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex items-center gap-10" aria-hidden={ariaHidden}>
      {WORDS.map((word, i) => (
        <div key={i} className="flex items-center gap-10">
          <span
            className={`whitespace-nowrap text-2xl font-extrabold md:text-3xl ${
              word.stroke ? 'stroke-text' : 'text-cream'
            }`}
          >
            {word.text}
          </span>
          <iconify-icon
            icon="ph:asterisk-bold"
            width="20"
            height="20"
            className={ASTERISK_COLORS[i % ASTERISK_COLORS.length]}
          />
        </div>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="overflow-hidden bg-ink py-7">
      <div className="flex w-max animate-marquee items-center gap-10">
        <WordGroup />
        <WordGroup ariaHidden />
      </div>
    </section>
  );
}
