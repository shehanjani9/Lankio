/* eslint-disable @next/next/no-img-element -- ImageResponse renders plain <img> */
import { ImageResponse } from 'next/og';
import { LOGO_ASPECT, logoSvg } from '@/lib/brand-logo';

export const OG_SIZE = { width: 1200, height: 630 };

const LOGO_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(logoSvg('#F4F5F7')).toString('base64')}`;

/**
 * Shared Open Graph composition: near-black canvas, soft violet/blue light,
 * the official Lankio logo, a headline, and optionally a project screenshot.
 */
export function renderOgImage({
  eyebrow,
  title,
  footer,
  image,
  tint = '#2c2470',
}: {
  eyebrow: string;
  title: string;
  footer: string;
  image?: string;
  tint?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#07080b',
          color: '#f4f5f7',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: `radial-gradient(900px 520px at 85% -10%, ${tint}, transparent 70%), radial-gradient(700px 500px at 0% 110%, rgba(139,125,255,0.28), transparent 70%)`,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, width: image ? 620 : '100%' }}>
          <img src={LOGO_DATA_URI} alt="" width={Math.round(44 * LOGO_ASPECT)} height={44} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: '#a3a8b4' }}>{eyebrow}</div>
            <div style={{ marginTop: 22, fontSize: image ? 58 : 72, lineHeight: 1.04, letterSpacing: -2, fontWeight: 600 }}>
              {title}
            </div>
          </div>
          <div style={{ fontSize: 22, color: '#a3a8b4' }}>{footer}</div>
        </div>
        {image && (
          <div style={{ display: 'flex', position: 'absolute', right: -40, top: 90, width: 600, height: 600 }}>
            <img
              src={image}
              alt=""
              width={600}
              height={375}
              style={{ borderRadius: 18, border: '1.5px solid rgba(255,255,255,0.14)', objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>
        )}
      </div>
    ),
    OG_SIZE
  );
}
