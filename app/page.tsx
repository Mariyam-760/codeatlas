// app/page.tsx - Main CodeAtlas application (FULLY FIXED)

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  Search,
  GitBranch,
  Star,
  Clock,
  Zap,
  Users,
  GitCompare,
  Sparkles,
  TrendingUp,
  Target,
  Lightbulb,
  X,
  ExternalLink,
} from 'lucide-react';
import { GalaxyScene } from '@/components/Galaxy/GalaxyScene';
import { GitHubData, Repo, SkillAnalysis, ViewMode } from '@/types';
import { LANGUAGE_COLORS, SAMPLE_USERS } from '@/lib/constants';

export default function CodeAtlas() {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<GitHubData | null>(null);
  const [compareData, setCompareData] = useState<GitHubData | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis | null>(null);
  const [mode, setMode] = useState<ViewMode>('single');
  const [showPanel, setShowPanel] = useState(false);
  const [showSkillsPanel, setShowSkillsPanel] = useState(true);
  const [filterLanguage, setFilterLanguage] = useState<string>('All');
  const [updatedWithinDays, setUpdatedWithinDays] = useState<number>(0); // 0 = all time
  const [timePlaying, setTimePlaying] = useState<boolean>(false);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  const updatedAfter: Date | null = useMemo(() => {
    if (!updatedWithinDays) return null;
    const d = new Date();
    d.setDate(d.getDate() - updatedWithinDays);
    return d;
  }, [updatedWithinDays]);

  // Parse URL params on load to restore state and auto-load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const u = params.get('user');
    const u2 = params.get('user2');
    const m = params.get('mode') as ViewMode | null;
    const lang = params.get('lang');
    const days = params.get('days');
    if (m) setMode(m);
    if (lang) setFilterLanguage(lang);
    if (days) setUpdatedWithinDays(Number(days));
    if (u) {
      setInputValue(u);
      loadGitHubData(u, false).then(() => {
        if (m === 'compare' && u2) {
          loadGitHubData(u2, true);
        }
      });
    }
  }, []);

  // Time-lapse animation
  useEffect(() => {
    if (!timePlaying) return;
    const id = setInterval(() => {
      setUpdatedWithinDays((d) => (d >= 365 ? 0 : d + 7));
    }, 700);
    return () => clearInterval(id);
  }, [timePlaying]);

  // Load GitHub data
  const loadGitHubData = async (username: string, isCompare = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/github?username=${username}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data');
      }

      if (!data || !Array.isArray(data.repos)) {
        throw new Error('Invalid API response: repos missing');
      }

      // Convert date strings back to Date objects
      data.repos = data.repos.map((repo: any) => ({
        ...repo,
        createdAt: new Date(repo.createdAt),
        updatedAt: new Date(repo.updatedAt),
      }));
      data.fetchedAt = new Date(data.fetchedAt);

      if (isCompare) {
        setCompareData(data);
      } else {
        setUserData(data);
        // Analyze skills
        const analysisResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repos: data.repos }),
        });
        const analysis = await analysisResponse.json();
        setSkillAnalysis(analysis);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load GitHub data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      loadGitHubData(inputValue.trim(), mode === 'compare' && !!userData);
    }
  };

  // ✅ FIXED: Added type annotation for username parameter
  const handleSampleUser = (username: string) => {
    setInputValue(username);
    loadGitHubData(username, mode === 'compare' && !!userData);
  };

  return (
    <div className="w-full h-screen text-white overflow-hidden relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Title and Mode Selector */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-cyan-400 drop-shadow-lg" />
              <h1 className="text-3xl font-bold text-gradient">CodeAtlas</h1>
              <span className="text-sm text-gray-400">
                GitHub Galaxy Visualizer
              </span>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2 flex-wrap overflow-x-auto no-scrollbar max-w-full justify-end">
              {(['single', 'team', 'compare'] as ViewMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-2 rounded-lg transition ${
                    mode === m
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 backdrop-blur-sm'
                  }`}
                >
                  {m === 'single' && <Zap className="w-4 h-4 inline mr-2" />}
                  {m === 'team' && <Users className="w-4 h-4 inline mr-2" />}
                  {m === 'compare' && (
                    <GitCompare className="w-4 h-4 inline mr-2" />
                  )}
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Filters & Tools */}
          {userData && (
            <div className="mt-3 flex flex-col md:flex-row md:items-center gap-3 text-sm overflow-x-auto no-scrollbar flex-wrap">
              {/* Language Filter */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Language:</span>
                <select
                  className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-sm"
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                >
                  <option>All</option>
                  {[...new Set(userData.repos.map((r) => r.language || 'Other'))]
                    .sort()
                    .map((lang) => (
                      <option key={lang}>{lang}</option>
                    ))}
                </select>
              </div>

              {/* Updated within days */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 whitespace-nowrap">Updated within:</span>
                <input
                  type="range"
                  min={0}
                  max={365}
                  step={7}
                  value={updatedWithinDays}
                  onChange={(e) => setUpdatedWithinDays(Number(e.target.value))}
                />
                <span className="w-20 text-gray-300">
                  {updatedWithinDays ? `${updatedWithinDays}d` : 'All time'}
                </span>
                <button
                  type="button"
                  onClick={() => setTimePlaying((p) => !p)}
                  className={`px-3 py-2 rounded-lg border ${timePlaying ? 'bg-cyan-600/70 border-cyan-500' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/70'}`}
                >
                  {timePlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  type="button"
                  onClick={() => setUpdatedWithinDays(0)}
                  className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-700/70"
                >
                  Reset
                </button>
              </div>

              {/* Snapshot */}
              <button
                type="button"
                onClick={() => {
                  const canvas = document.querySelector('canvas');
                  if (!canvas) return;
                  const url = (canvas as HTMLCanvasElement).toDataURL('image/png');
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `codeatlas-${userData.user.login}.png`;
                  a.click();
                }}
                className="ml-auto px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 rounded-lg border border-gray-700"
              >
                Snapshot
              </button>

              {/* Share Link */}
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set('user', userData.user.login);
                  if (mode === 'compare' && compareData?.user?.login) params.set('user2', compareData.user.login);
                  params.set('mode', mode);
                  if (filterLanguage) params.set('lang', filterLanguage);
                  params.set('days', String(updatedWithinDays));
                  const share = `${window.location.origin}?${params.toString()}`;
                  navigator.clipboard.writeText(share);
                }}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 rounded-lg border border-gray-700"
              >
                Copy Link
              </button>

              {/* Dashboard toggle */}
              <button
                type="button"
                onClick={() => setShowDashboard((s) => !s)}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 rounded-lg border border-gray-700"
              >
                {showDashboard ? 'Hide' : 'Dashboard'}
              </button>
            </div>
          )}

      {/* Reopen AI panel button */}
      {userData && skillAnalysis && !showSkillsPanel && (
        <button
          onClick={() => setShowSkillsPanel(true)}
          className="absolute left-4 bottom-4 z-20 px-3 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg flex items-center gap-2"
          aria-label="Open AI Skill Analysis"
        >
          <Sparkles className="w-4 h-4" />
          AI Panel
        </button>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            mode === 'compare' && userData
              ? 'Enter second GitHub username...'
              : 'Enter GitHub username...'
          }
          className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-sm glass"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 btn-primary rounded-lg disabled:opacity-50 flex items-center gap-2 shadow-lg"
        >
          <Search className="w-5 h-5" />
          {loading ? 'Loading...' : 'Explore'}
        </button>
      </form>

          {/* Sample Users - ✅ FIXED: Added explicit type annotation */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Try:</span>
            {SAMPLE_USERS.slice(0, 4).map((user: { username: string; name: string }) => (
              <button
                key={user.username}
                onClick={() => handleSampleUser(user.username)}
                className="px-3 py-1 bg-gray-800/30 hover:bg-gray-700/50 rounded-full text-cyan-400 transition backdrop-blur-sm"
                disabled={loading}
              >
                {user.username}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 backdrop-blur-sm">
              {error}
            </div>
          )}
        </div>
      </header>

      {/* 3D Canvas */}
      {userData && (
        <Canvas
          className="absolute inset-0 z-0"
          shadows
          dpr={[1, 2]}
          camera={{
            position: [0, 0, 30],
            fov: 60,
            near: 0.1,
            far: 500,
          }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false,
            preserveDrawingBuffer: false,
          }}
        >
          <GalaxyScene
            repos={userData.repos}
            onPlanetClick={(repo: Repo) => {
              setSelectedRepo(repo);
              setShowPanel(true);
            }}
            selectedRepo={selectedRepo}
            filterLanguage={filterLanguage}
            updatedAfter={updatedAfter}
            offset={mode === 'compare' ? [-12, 0, 0] : [0, 0, 0]}
          />
          {mode === 'compare' && compareData && (
            <GalaxyScene
              repos={compareData.repos}
              onPlanetClick={(repo: Repo) => {
                setSelectedRepo(repo);
                setShowPanel(true);
              }}
              selectedRepo={selectedRepo}
              filterLanguage={filterLanguage}
              updatedAfter={updatedAfter}
              offset={[12, 0, 0]}
            />
          )}
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={5}
            maxDistance={50}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.5}
          />
        </Canvas>
      )}

      {/* Compare legend */}
      {mode === 'compare' && userData && compareData && (
        <div className="absolute top-[84px] right-6 z-20 glass px-3 py-2 rounded-lg flex items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> {userData.user.login}</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /> {compareData.user.login}</span>
        </div>
      )}

      {/* Repository Info Panel */}
      {showPanel && selectedRepo && (
        <aside className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 p-6 overflow-y-auto z-20 slide-in-right">
          <button
            onClick={() => setShowPanel(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">{selectedRepo.name}</h2>
            {selectedRepo.description && (
              <p className="text-gray-300 text-sm">{selectedRepo.description}</p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-xs text-gray-400">Stars</span>
              </div>
              <div className="text-2xl font-bold">{selectedRepo.stars}</div>
            </div>

            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <GitBranch className="w-4 h-4" />
                <span className="text-xs text-gray-400">Forks</span>
              </div>
              <div className="text-2xl font-bold">{selectedRepo.forks}</div>
            </div>
          </div>

          {/* Language */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 text-gray-400">
              Language
            </h3>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor:
                    LANGUAGE_COLORS[selectedRepo.language] ||
                    LANGUAGE_COLORS.Other,
                }}
              />
              <span className="text-sm">{selectedRepo.language}</span>
            </div>
          </div>

          {/* Topics */}
          {selectedRepo.topics.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-gray-400">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedRepo.topics.map((topic: string) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>
                Updated {selectedRepo.updatedAt.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span>Created {selectedRepo.createdAt.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action Button */}
          <a
            href={selectedRepo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 btn-primary rounded-lg text-center shadow-lg"
          >
            View on GitHub
            <ExternalLink className="w-4 h-4" />
          </a>
        </aside>
      )}

      {/* Skills Analysis Panel */}
      {skillAnalysis && userData && showSkillsPanel && (
        <aside className="absolute left-0 bottom-0 w-full sm:w-96 max-h-[70vh] overflow-y-auto bg-gray-900/95 backdrop-blur-sm border-t border-r border-gray-700 p-6 z-20 rounded-tr-2xl slide-in-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              AI Skill Analysis
            </h3>
            <button
              onClick={() => setShowSkillsPanel(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Skill Level Badge */}
          <div className="mb-4 p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Skill Level</span>
              <span className="px-3 py-1 bg-cyan-500 text-white rounded-full text-xs font-bold uppercase">
                {skillAnalysis.skillLevel}
              </span>
            </div>
          </div>

          {/* Top Languages */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-gray-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Top Languages
            </h4>
            <div className="space-y-2">
              {skillAnalysis.topLanguages.slice(0, 5).map(({ name, count, percentage, color }) => (
                <div key={name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span>{name}</span>
                    </div>
                    <span className="text-gray-400">{count} repos</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Areas */}
          {skillAnalysis.focusAreas.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Focus Areas
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillAnalysis.focusAreas.map((area: string) => (
                  <span
                    key={area}
                    className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prediction */}
          <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20 mb-4">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Growth Prediction
            </h4>
            <p className="text-sm text-gray-300">{skillAnalysis.prediction}</p>
          </div>

          {/* Recommendations */}
          {skillAnalysis.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-400 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Recommendations
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                {skillAnalysis.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
            Analyzing {userData.repos.length} repositories
          </div>
        </aside>
      )}

      {/* Welcome Screen */}
      {!userData && !loading && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="text-center max-w-3xl fade-in">
            <Sparkles className="w-20 h-20 mx-auto mb-6 text-cyan-400 drop-shadow-lg" />
            <h2 className="text-6xl font-bold mb-6">
              <span className="text-gradient">Explore Your Code Galaxy</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transform your GitHub profile into a stunning 3D visualization.
              <br />
              Each repository becomes a planet, orbiting in the cosmos of code.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 glass rounded-lg">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Star Count</h3>
                <p className="text-sm text-gray-400">Planet size</p>
              </div>
              <div className="p-4 glass rounded-lg">
                <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Activity</h3>
                <p className="text-sm text-gray-400">Brightness</p>
              </div>
              <div className="p-4 glass rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">AI Analysis</h3>
                <p className="text-sm text-gray-400">Skill predictions</p>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Powered by GitHub API, Three.js, and AI
            </p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-30">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg">Loading galaxy data...</p>
          </div>
        </div>
      )}
    </div>
  );
}