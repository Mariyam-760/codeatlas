// app/api/github/route.ts - GitHub API proxy endpoint

import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubData } from '@/lib/github';

// Cache for GitHub data (in-memory, use Redis in production)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Check cache
    const cached = cache.get(username);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Fetch from GitHub
    const token = process.env.GITHUB_TOKEN;
    const data = await fetchGitHubData(username, token || '');


    // Update cache
    cache.set(username, { data, timestamp: Date.now() });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}

// Clear cache endpoint (optional)
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (username) {
    cache.delete(username);
  } else {
    cache.clear();
  }

  return NextResponse.json({ success: true });
}