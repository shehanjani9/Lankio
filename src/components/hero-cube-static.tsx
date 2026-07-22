// No animation, no three.js -- this is the entire visual for anyone with
// prefers-reduced-motion enabled, so it must not depend on the 3D bundle at all.
export function HeroCubeStatic() {
  return (
    <div className="glass-panel flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 200 200" className="h-32 w-32" aria-hidden="true">
        <polygon
          points="100,20 170,55 100,90 30,55"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="2"
          opacity="0.85"
        />
        <polygon
          points="30,55 100,90 100,170 30,135"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          opacity="0.85"
        />
        <polygon
          points="170,55 100,90 100,170 170,135"
          fill="none"
          stroke="#06B6D4"
          strokeWidth="2"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
