import { useTranslations } from "next-intl";
import Link from "next/link";

export default function FAQPage() {
  const t = useTranslations("FAQ");

  // Fetch array from next-intl
  const items = t.raw("items") as Array<{ q: string; a: string }>;

  return (
    <main className="min-h-screen py-20 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
          {t("eyebrow")}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold mb-2">{item.q}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center p-8 rounded-3xl border border-border bg-gradient-to-b from-card to-background">
        <h2 className="text-2xl font-bold mb-2">{t("ctaTitle")}</h2>
        <p className="text-muted-foreground mb-6">{t("ctaSubtitle")}</p>
        <Link
          href="/#contact"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          {t("ctaButton")}
        </Link>
      </div>
    </main>
  );
}