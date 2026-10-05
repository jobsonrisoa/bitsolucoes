export function Mark({ className }: { className?: string }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="33" />
        <circle cx="50" cy="50" r="19" />
        {petals.map((degrees) => (
          <ellipse
            key={degrees}
            cx="50"
            cy="28"
            rx="8"
            ry="22"
            transform={`rotate(${degrees} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="7" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
