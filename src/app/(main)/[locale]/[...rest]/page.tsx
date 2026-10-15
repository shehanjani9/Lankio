import { notFound } from 'next/navigation';

// Unknown paths inside a locale (e.g. /en/missing) render the localized
// not-found page instead of Next's generic one.
export default function CatchAll() {
  notFound();
}
