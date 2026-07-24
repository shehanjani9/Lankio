import type { Metadata } from 'next';
import '../../globals.css';

// This is a second, independent root layout -- Next.js supports this
// pattern (see "Creating Multiple Root Layouts" in the App Router docs) for
// branches of the app that need a genuinely separate <html>/<body>, rather
// than sharing the locale-aware one in src/app/(main)/[locale]/layout.tsx.
//
// Demo pages are self-contained (their own colors, and the hotel page loads
// its own Playfair Display font directly) -- so this deliberately has no
// Sora/Inter/JetBrains font loading and no NextIntlClientProvider. It DOES
// need globals.css, though: that's where Tailwind's base/components/utilities
// directives live, and every one of the demo pages' Tailwind classes
// resolves to nothing without it.
export const metadata: Metadata = {
  title: 'Lankio Template Preview',
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        overflow-x-hidden as a defensive baseline: these pages render inside
        an iframe at fixed widths down to 390px (the modal's "Mobile" view),
        and a single slightly-too-wide element would otherwise introduce a
        horizontal scrollbar inside that constrained frame.
      */}
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
