export default function GrowthLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 320" fill="none" className={className}>
      <path
        d="
          M 20 280
          L 90 260
          L 120 210
          L 180 190
          L 230 130
          L 250 80
          L 290 70
          L 320 20
        "
        stroke="url(#growthGradient)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        shapeRendering="geometricPrecision"
      />

      <defs>
        <linearGradient
          id="growthGradient"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
    </svg>
  );
}
