// Aniconic 8-point khatam-star girih grid, hairline gold at very low opacity —
// background texture only (brief §6). Fixed, non-interactive, pointer-none.
export function GeometricBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="khatam" width="72" height="72" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
            <g stroke="#D4AF37" strokeWidth="1" fill="none">
              {/* 8-point star built from two overlaid squares + diagonals */}
              <rect x="18" y="18" width="36" height="36" />
              <rect x="18" y="18" width="36" height="36" transform="rotate(45 36 36)" />
              <line x1="0" y1="36" x2="72" y2="36" />
              <line x1="36" y1="0" x2="36" y2="72" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#khatam)" />
      </svg>
    </div>
  );
}
