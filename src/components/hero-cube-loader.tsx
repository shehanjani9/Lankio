export function HeroCubeLoader() {
  return (
    <div
      className="glass-panel relative flex h-full w-full items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-24 w-24 animate-pulse rounded-2xl border border-[color:var(--glass-border)]"
        style={{
          background:
            'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.12), rgba(6,182,212,0.15))',
        }}
      />
    </div>
  );
}
