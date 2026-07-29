import { Navbar } from '@/components/navbar';
import { AuditSection } from '@/components/audit-section';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AuditPage({ params }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { locale } = await params;
  // If this project's other locale-aware pages call setRequestLocale(locale)
  // for next-intl static rendering (check src/app/(main)/[locale]/faq/page.tsx
  // for the exact pattern used elsewhere), mirror that call here:
  // setRequestLocale(locale);

  return (
    // min-h-screen only -- background color comes from the root layout's
    // body styles (--bg-base / #0B0D12), not set here, per the constraint
    // not to touch color/design tokens on a per-page basis.
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <AuditSection />
      </div>
    </div>
  );
}
