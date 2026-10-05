export function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4">
      <polyline points="20 40 50 70 80 40" />
    </svg>
  );
}
