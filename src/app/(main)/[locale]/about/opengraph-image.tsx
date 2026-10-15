import { OG_SIZE } from '@/components/seo/og-template';
import { pageOgImage } from '@/components/seo/page-og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Lankio Digital Solutions';

export default function Image({ params }: { params: Promise<{ locale: string }> }) {
  return pageOgImage(params, 'about');
}
