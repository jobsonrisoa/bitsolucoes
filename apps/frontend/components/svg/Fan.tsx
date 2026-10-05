export function Fan({ className }: { className?: string }) {
  return (
    <svg viewBox="-60 40 520 260" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M-50 200 H240 A60 60 0 0 1 300 260" />
        <path d="M-50 178 H240 A82 82 0 0 1 322 260" />
        <path d="M-50 156 H240 A104 104 0 0 1 344 260" />
        <path d="M-50 134 H240 A126 126 0 0 1 366 260" />
        <path d="M-50 112 H240 A148 148 0 0 1 388 260" />
        <path d="M-50 90 H240 A170 170 0 0 1 410 260" />
        <path d="M-50 68 H240 A192 192 0 0 1 432 260" />
      </g>
      <path
        d="M300 260 A130 130 0 0 1 430 130 L430 200 A60 60 0 0 0 370 260 Z"
        fill="currentColor"
        opacity=".9"
      />
    </svg>
  );
}
