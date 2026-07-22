import { NextRequest, NextResponse } from 'next/server';

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function toScore(value: number | undefined): number | null {
  return typeof value === 'number' ? Math.round(value * 100) : null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  const targetUrl = normalizeUrl(rawUrl);
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;

  const params = new URLSearchParams({ url: targetUrl, strategy: 'mobile' });
  params.append('category', 'PERFORMANCE');
  params.append('category', 'ACCESSIBILITY');
  params.append('category', 'SEO');
  params.append('category', 'BEST_PRACTICES');
  if (apiKey) params.set('key', apiKey);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      // Covers rate limiting (429) and PSI's own analysis failures (400/500)
      return NextResponse.json({ error: 'PageSpeed request failed' }, { status: 502 });
    }

    const data = await res.json();
    const categories = data?.lighthouseResult?.categories;

    const performance = toScore(categories?.performance?.score);
    const accessibility = toScore(categories?.accessibility?.score);
    const seo = toScore(categories?.seo?.score);
    const bestPractices = toScore(categories?.['best-practices']?.score);

    if (performance === null || accessibility === null || seo === null || bestPractices === null) {
      return NextResponse.json({ error: 'Incomplete PageSpeed data' }, { status: 502 });
    }

    const overall = Math.round((performance + accessibility + seo + bestPractices) / 4);

    return NextResponse.json({
      overall,
      metrics: [
        { label: 'Speed', score: performance },
        { label: 'Best Practices', score: bestPractices },
        { label: 'SEO', score: seo },
        { label: 'Accessibility', score: accessibility },
      ],
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error('PageSpeed fetch failed:', error);
    return NextResponse.json({ error: 'PageSpeed request failed or timed out' }, { status: 504 });
  }
}
