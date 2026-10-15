import { serializeJsonLd } from '@/lib/seo';

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Serialised with "<" escaped to prevent script injection.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
