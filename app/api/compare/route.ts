import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Your comparison logic here, e.g., compare two repos or data
  // Example: Extract query params or body data
  const { searchParams } = new URL(request.url);
  const repo1 = searchParams.get('repo1');
  const repo2 = searchParams.get('repo2');

  // Perform comparison (replace with your code)
  const result = { comparison: `${repo1} vs ${repo2}` };

  return NextResponse.json(result);
}

// If you need POST or other methods, add them similarly
export async function POST(request: NextRequest) {
  // Handle POST requests for comparison
}