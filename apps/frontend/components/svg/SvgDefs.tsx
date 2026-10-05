export function SvgDefs() {
  return (
    <svg style={{ display: 'none' }}>
      <defs>
        <clipPath id="clip-iris" clipPathUnits="objectBoundingBox">
          <circle cx="0.5" cy="0.5" r="0" />
        </clipPath>
      </defs>
    </svg>
  );
}
