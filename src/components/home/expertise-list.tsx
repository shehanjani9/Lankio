import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/reveal';

export const EXPERTISE_KEYS = ['web', 'brand', 'motion', 'media', 'marketing'] as const;

/** Numbered expertise rows; `detailed` adds the deliverables list. */
export function ExpertiseList({ detailed = false }: { detailed?: boolean }) {
  const t = useTranslations('Expertise');
  // On the expertise page the groups sit directly under the h1.
  const Title = detailed ? 'h2' : 'h3';
  const Sub = detailed ? 'h3' : 'h4';

  return (
    <ol className="border-t border-line">
      {EXPERTISE_KEYS.map((key, index) => {
        const items = t.raw(`groups.${key}.items`) as string[];
        return (
          <Reveal
            as="li"
            key={key}
            delay={index * 0.05}
            id={detailed ? key : undefined}
            className="group grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-8 md:py-12"
          >
            <span className="text-sm tabular-nums text-fg-subtle md:col-span-1 md:pt-2">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="md:col-span-5">
              <Title className="text-title text-fg transition-transform duration-700 ease-out-expo md:group-hover:translate-x-2">
                {t(`groups.${key}.title`)}
              </Title>
            </div>
            <div className="md:col-span-6">
              <p className="text-fg-muted leading-relaxed">{t(`groups.${key}.summary`)}</p>
              {detailed ? (
                <>
                  <Sub className="text-eyebrow mt-8 text-fg-subtle">{t('deliverables')}</Sub>
                  <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-baseline gap-3 text-[0.95rem] text-fg">
                        <span aria-hidden="true" className="size-1 shrink-0 translate-y-[-0.2em] rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-4 text-sm text-fg-subtle">{items.slice(0, 4).join(' · ')}</p>
              )}
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
