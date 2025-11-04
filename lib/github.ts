export async function fetchGitHubData(username: string, token: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github+json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Fetch user profile
  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers,
    // next: { revalidate: 300 }, // optional caching hint in Next
  });
  if (!userRes.ok) {
    const msg = await safeError(userRes);
    throw new Error(msg || 'Failed to fetch GitHub user');
  }
  const user = await userRes.json();

  // Fetch repositories (most recent first)
  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers }
  );
  if (!reposRes.ok) {
    const msg = await safeError(reposRes);
    throw new Error(msg || 'Failed to fetch GitHub repositories');
  }
  const reposJson: any[] = await reposRes.json();

  // Normalize to UI Repo[] shape
  const repos = reposJson.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description || '',
    language: r.language || 'Other',
    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    url: r.html_url,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    size: r.size ?? 0,
    topics: Array.isArray(r.topics) ? r.topics : [],
  }));

  return {
    user: {
      login: user.login,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      bio: user.bio ?? undefined,
      name: user.name ?? undefined,
      company: user.company ?? undefined,
      location: user.location ?? undefined,
      email: user.email ?? undefined,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      public_repos: user.public_repos ?? repos.length,
      created_at: user.created_at,
    },
    repos,
    fetchedAt: new Date().toISOString(),
  };
}

async function safeError(res: Response) {
  try {
    const t = await res.text();
    return t;
  } catch {
    return undefined;
  }
}