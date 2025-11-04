export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Lua: '#000080',
  Perl: '#0298c3',
  R: '#198CE7',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  Haskell: '#5e5086',
  Vim: '#199f4b',
  Emacs: '#c065db',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Other: '#8b949e',
};

export const FRAMEWORK_COLORS: Record<string, string> = {
  react: '#61dafb',
  nextjs: '#000000',
  vue: '#42b883',
  angular: '#dd0031',
  svelte: '#ff3e00',
  'machine-learning': '#ff6f00',
  ai: '#9c27b0',
  tensorflow: '#ff6f00',
  pytorch: '#ee4c2c',
  docker: '#2496ed',
  kubernetes: '#326ce5',
  aws: '#ff9900',
  azure: '#0089d6',
  blockchain: '#f7931a',
};

export const SKILL_PREDICTIONS: Record<string, string[]> = {
  JavaScript: [
    'Consider exploring TypeScript for better type safety',
    'Modern frameworks: Next.js, SvelteKit, or Astro',
    'Backend with Node.js and Express/Fastify',
  ],
  Python: [
    'ML/AI potential - explore TensorFlow or PyTorch',
    'Data science with Pandas and NumPy',
    'Web APIs with FastAPI or Django',
  ],
  Java: [
    'Spring Boot for microservices architecture',
    'Explore Kotlin as a modern JVM language',
    'Cloud-native with Quarkus',
  ],
  TypeScript: [
    'Advanced frontend with React/Next.js',
    'Explore WebAssembly for performance',
    'Full-stack with tRPC or GraphQL',
  ],
  Go: [
    'Cloud-native development with Kubernetes',
    'Distributed systems and microservices',
    'CLI tools and infrastructure automation',
  ],
  Rust: [
    'Systems programming and performance',
    'WebAssembly for browser applications',
    'Embedded systems and IoT',
  ],
  Ruby: [
    'Modern Rails 7+ with Hotwire',
    'API development with Grape or Sinatra',
    'DevOps automation with Chef',
  ],
  PHP: [
    'Modern PHP 8+ with Laravel',
    'API development with Symfony',
    'Serverless PHP with Bref',
  ],
  Swift: [
    'iOS/macOS app development',
    'SwiftUI for modern UI',
    'Server-side Swift with Vapor',
  ],
  Kotlin: [
    'Android app development',
    'Multiplatform mobile with KMM',
    'Backend with Ktor',
  ],
};

export const GALAXY_CONFIG = {
  MIN_PLANET_SIZE: 0.1,
  MAX_PLANET_SIZE: 1.5,
  STAR_SIZE_MULTIPLIER: 0.02,
  MIN_ORBIT_RADIUS: 2,
  ORBIT_RADIUS_INCREMENT: 0.5,
  BASE_SOLAR_SYSTEM_DISTANCE: 5,
  MAX_SOLAR_SYSTEM_DISTANCE: 15,
  BRIGHTNESS_DECAY_DAYS: 365,
  MIN_BRIGHTNESS: 0.3,
  ROTATION_SPEED: 0.01,
  ORBIT_SPEED: 0.001,
  CAMERA_DEFAULT_POSITION: [0, 5, 20] as [number, number, number],
  CAMERA_FOV: 60,
  CAMERA_MIN_DISTANCE: 5,
  CAMERA_MAX_DISTANCE: 50,
};

export const API_CONFIG = {
  GITHUB_API_BASE: 'https://api.github.com',
  RATE_LIMIT_WAIT: 60000,
  CACHE_DURATION: 300000,
  MAX_REPOS: 100,
};

export const SAMPLE_USERS = [
  { username: 'torvalds', name: 'Linus Torvalds' },
  { username: 'gaearon', name: 'Dan Abramov' },
  { username: 'tj', name: 'TJ Holowaychuk' },
  { username: 'sindresorhus', name: 'Sindre Sorhus' },
  { username: 'kentcdodds', name: 'Kent C. Dodds' },
  { username: 'addyosmani', name: 'Addy Osmani' },
];
