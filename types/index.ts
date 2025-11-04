// types/index.ts - Core TypeScript types

export interface Repo {
  id: number;
  name: string;
  description?: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  size: number;
  topics: string[];
  commits?: number;
  contributors?: number;
  openIssues?: number;
  hasReadme?: boolean;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  bio?: string;
  name?: string;
  company?: string;
  location?: string;
  email?: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface GitHubData {
  user: GitHubUser;
  repos: Repo[];
  fetchedAt: Date;
}

export interface SkillAnalysis {
  topLanguages: LanguageStat[];
  frameworks: string[];
  prediction: string;
  recommendations: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  focusAreas: string[];
}

export interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TimelineEvent {
  date: Date;
  repos: Repo[];
  languages: string[];
  activity: number;
}

export interface CompareResult {
  user1: GitHubData;
  user2: GitHubData;
  commonLanguages: string[];
  uniqueUser1: string[];
  uniqueUser2: string[];
  skillOverlap: number;
  recommendations: string[];
}

export interface TeamGalaxy {
  users: GitHubData[];
  combinedRepos: Repo[];
  sharedTechnologies: string[];
  teamSkills: SkillAnalysis;
}

export type ViewMode = 'single' | 'team' | 'compare';

export interface AppState {
  mode: ViewMode;
  userData: GitHubData | null;
  compareData: GitHubData | null;
  teamData: GitHubData[];
  selectedRepo: Repo | null;
  skillAnalysis: SkillAnalysis | null;
  loading: boolean;
  error: string | null;
  timelineRange: [Date, Date] | null;
  showPanel: boolean;
  setMode: (mode: ViewMode) => void;
  setUserData: (data: GitHubData | null) => void;
  setCompareData: (data: GitHubData | null) => void;
  addTeamMember: (data: GitHubData) => void;
  setSelectedRepo: (repo: Repo | null) => void;
  setSkillAnalysis: (analysis: SkillAnalysis | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setShowPanel: (show: boolean) => void;
}