import type { CubeService, ServiceId } from './hero-cube';
import { SERVICE_FACE_ORDER } from './hero-cube';

// No animation, no three.js -- this is the entire visual for anyone with
// prefers-reduced-motion enabled, so it must not depend on the 3D bundle at
// all. It still needs to land the same brand point the cube does ("we
// organize your six-service complexity"), so the polygon keeps its place and
// the six services are listed as static chips rather than glowing labels.
export function HeroCubeStatic({
  services,
}: {
  services: Record<ServiceId, CubeService>;
}) {
  return (
    <div className="glass-panel flex h-full w-full flex-col items-center justify-center gap-6 p-6">
      <svg viewBox="0 0 200 200" className="h-28 w-28" aria-hidden="true">
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

      <ul className="flex flex-wrap items-center justify-center gap-2" aria-label="Core services">
        {SERVICE_FACE_ORDER.map((id) => (
          <li
            key={id}
            className="font-mono-label rounded-full border border-[color:var(--glass-border)] px-3 py-1 text-xs text-[color:var(--text-secondary)]"
          >
            {services[id].label}
          </li>
        ))}
      </ul>
    </div>
  );
}
