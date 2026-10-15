'use client';

/**
 * A script that must run synchronously during HTML parsing, before first
 * paint -- the pattern from the Next.js guide "How to prevent flash before
 * hydration".
 *
 * - Server render: `type="text/javascript"`, so the browser executes it while
 *   parsing the server HTML.
 * - Client render: `type="text/plain"`, an inert data block. React only warns
 *   ("Encountered a script tag while rendering React component") when it
 *   creates an executable script on the client, which happens whenever the
 *   root layout re-renders client-side (e.g. a /en -> /it navigation, or
 *   Fast Refresh). Scripts created by React never execute anyway, so the
 *   pre-paint work is done once per document load, and the consent UI keeps
 *   itself correct from React state after hydration.
 * - `suppressHydrationWarning` accepts the server/client `type` difference.
 *
 * This has to be a Client Component: in a Server Component `typeof window`
 * is always evaluated on the server, so the client would still receive
 * `text/javascript` and warn.
 *
 * Only pass trusted, static code -- never user input.
 *
 * `next/script` with `strategy="beforeInteractive"` is not used on purpose:
 * in the App Router it only queues inline code (`self.__next_s.push(...)`)
 * for Next's client bootstrap, which runs after the JavaScript bundles load.
 * Measured on a throttled phone profile, that left the consent banner
 * visible to returning visitors for ~1.4 s before hiding it.
 */
export function InlineScript({ id, code }: { id: string; code: string }) {
  return (
    <script
      id={id}
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
