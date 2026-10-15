import Image from 'next/image';
import type { Locale } from '@/i18n/routing';
import type { ImageAsset } from '@/content/projects/types';
import { Reveal } from '@/components/motion/reveal';

/**
 * Case-study gallery. Desktop captures get a minimal browser frame;
 * phone captures are grouped on a tinted stage so they read as a set.
 */
export function ProjectGallery({ images, locale, tint }: { images: ImageAsset[]; locale: Locale; tint?: string }) {
  const desktop = images.filter((image) => image.frame !== 'mobile');
  const mobile = images.filter((image) => image.frame === 'mobile');

  return (
    <div className="space-y-8 md:space-y-12">
      {desktop.map((image) => (
        <Reveal as="figure" key={image.src}>
          <div className="overflow-hidden rounded-[1.25rem] border border-line bg-surface shadow-[0_40px_120px_-40px_rgb(0_0_0/0.8)]">
            {image.frame === 'desktop' && (
              <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-line px-4 py-3">
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
              </div>
            )}
            <Image
              src={image.src}
              alt={image.alt[locale]}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1408px) 1312px, 94vw"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
      ))}

      {mobile.length > 0 && (
        <Reveal>
          <div
            className="relative flex flex-wrap items-end justify-center gap-6 overflow-hidden rounded-[1.75rem] border border-line px-6 pt-12 md:gap-12 md:px-12 md:pt-20"
            style={{ background: `radial-gradient(100% 80% at 50% 0%, ${tint ?? '#2c2470'}, transparent 75%)` }}
          >
            <div aria-hidden="true" className="bg-grain absolute inset-0" />
            {mobile.map((image) => (
              <figure
                key={image.src}
                className="relative w-[min(17rem,70vw)] overflow-hidden rounded-t-[2.25rem] border-[6px] border-b-0 border-black bg-black shadow-2xl ring-1 ring-white/10"
              >
                <Image
                  src={image.src}
                  alt={image.alt[locale]}
                  width={image.width}
                  height={image.height}
                  sizes="272px"
                  className="h-auto w-full"
                  style={{ maxHeight: '34rem', objectFit: 'cover', objectPosition: 'top' }}
                />
              </figure>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
