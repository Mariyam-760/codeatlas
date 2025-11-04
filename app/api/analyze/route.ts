import { NextRequest, NextResponse } from 'next/server';
import { LANGUAGE_COLORS, SKILL_PREDICTIONS } from '@/lib/constants';

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const repos: any[] = Array.isArray(body?.repos) ? body.repos : [];

    // Aggregate languages
    const counts: Record<string, number> = {};
    for (const r of repos) {
      const lang = r.language || 'Other';
      counts[lang] = (counts[lang] || 0) + 1;
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const topLanguages = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
        color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS.Other,
      }));

    // Naive skill level heuristic
    const repoCount = repos.length;
    const starSum = repos.reduce((s, r) => s + (r.stars || 0), 0);
    const skillLevel = repoCount > 50 || starSum > 500
      ? 'expert'
      : repoCount > 25 || starSum > 200
      ? 'advanced'
      : repoCount > 10 || starSum > 50
      ? 'intermediate'
      : 'beginner';

    const focusAreas = topLanguages.slice(0, 5).map((l) => l.name);

    // Recommendations from predictions table if available
    const recs: string[] = [];
    for (const lang of focusAreas) {
      const list = SKILL_PREDICTIONS[lang];
      if (list) recs.push(...list.slice(0, 1));
    }

    const analysis = {
      topLanguages,
      frameworks: [],
      prediction: `Expect growth across ${focusAreas.slice(0, 3).join(', ')} based on repository activity and language distribution.`,
      recommendations: recs.slice(0, 5),
      skillLevel,
      focusAreas,
    };

    return NextResponse.json(analysis);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to analyze' }, { status: 400 });
  }
}