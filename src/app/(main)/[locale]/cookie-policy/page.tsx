import { useTranslations } from "next-intl";

export default function PrivacyPolicyPage() {
  const t = useTranslations("CookiePolicy");

  const sections = ["dataCollected", "dataUsage", "cookies", "rights"] as const;

  return (
    <main className="min-h-screen py-20 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("title")}</h1>
      <p className="text-sm text-muted-foreground mb-8">{t("lastUpdated")}</p>

      <p className="text-muted-foreground leading-relaxed mb-8">{t("intro")}</p>

      <div className="space-y-8">
        {sections.map((key) => (
          <section key={key} className="space-y-2">
            <h2 className="text-xl font-semibold">
              {t(`sections.${key}.title`)}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t(`sections.${key}.body`)}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}