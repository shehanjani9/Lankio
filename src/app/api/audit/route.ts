import { NextRequest, NextResponse } from 'next/server';

// 1. Vercel Serverless Timeout එක තත්පර 60 දක්වා වැඩි කිරීම
export const maxDuration = 60;

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

  // 2. Timeout එක තත්පර 9 සිට තත්පර 45 දක්වා වැඩි කළා (PageSpeed audit එකට ප්‍රමාණවත් කාලයක් දීමට)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
      // PageSpeed API Responses Cache නොකර ලබා ගැනීමට (Next.js Data Cache Fix)
      cache: 'no-store', 
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`PageSpeed API Error Status: ${res.status}`);
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
  } catch (error: any) {
    clearTimeout(timeout);
    
    // Detailed Logging for Debugging
    if (error.name === 'AbortError') {
      console.error('PageSpeed Request Timed Out after 45s');
      return NextResponse.json({ error: 'PageSpeed request timed out. Please try again.' }, { status: 504 });
    }

    console.error('PageSpeed fetch failed:', error);
    return NextResponse.json({ error: 'PageSpeed request failed' }, { status: 500 });
  }
}