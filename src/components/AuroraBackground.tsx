export function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Orb 1 — large green, top-left */}
      <div className="aurora-orb aurora-1" />
      {/* Orb 2 — sky blue, top-right */}
      <div className="aurora-orb aurora-2" />
      {/* Orb 3 — indigo, bottom */}
      <div className="aurora-orb aurora-3" />
      {/* Orb 4 — green accent, mid-right */}
      <div className="aurora-orb aurora-4" />
      {/* Film-grain noise texture */}
      <div className="noise-layer" />
    </div>
  );
}
