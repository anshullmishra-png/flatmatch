export default function ScrollIndicator() {
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 144 144" className="h-full w-full animate-spin360">
        <defs>
          <path id="circlePath" d="M 72,72 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" />
        </defs>
        <text className="font-mono uppercase" fill="#000000" fontSize="11" letterSpacing="1">
          <textPath href="#circlePath" startOffset="0%">
            Scroll Down • Scroll Down • Scroll Down •
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
          <path d="M12 4v16M6 14l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
