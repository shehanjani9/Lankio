// Remounts on every navigation, replaying a short CSS fade so route changes
// feel continuous without delaying them or depending on hydration.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
