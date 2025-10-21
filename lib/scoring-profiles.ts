/**
 * Pre-built scoring profiles for different roles
 */

import { ScoringProfile, ScoringRule } from '@/types/scoring';

/**
 * Front-End Developer (Senior) Scoring Profile
 * Based on the comprehensive rubric designed for modern React/TypeScript roles
 */
export const FRONTEND_DEVELOPER_SENIOR: ScoringProfile = {
  id: 'frontend-developer-senior',
  name: 'Front-End Developer (Senior)',
  description: 'Scoring profile for senior-level front-end engineers with React, TypeScript, and modern web stack expertise',
  roleType: 'Front-End Developer',

  // Category Weights (must sum to 1.0)
  weights: {
    technical: 0.35, // 35% - Most important
    experience: 0.25, // 25%
    impact: 0.20, // 20%
    portfolio: 0.15, // 15%
    foundation: 0.05, // 5%
  },

  // TECHNICAL SKILLS RULES (35 points max)
  technicalRules: [
    {
      name: 'Core Framework',
      description: 'React/Vue/Angular expertise with modern patterns',
      maxPoints: 7,
      requiredAny: ['react', 'vue', 'angular'],
      bonusKeywords: [
        { keyword: 'hooks', points: 1 },
        { keyword: 'typescript', points: 1 },
        { keyword: 'context', points: 0.5 },
        { keyword: 'rsc', points: 0.5 },
        { keyword: 'server components', points: 0.5 },
      ],
      // Full 7 points: React + hooks + TypeScript
      // 5 points: React + (TypeScript OR hooks)
      // 3 points: React OR Vue OR Angular
    },
    {
      name: 'JavaScript/TypeScript',
      description: 'Modern JavaScript and TypeScript proficiency',
      maxPoints: 8,
      keywords: ['javascript', 'typescript', 'es6', 'es2015', 'async', 'await'],
      bonusKeywords: [
        { keyword: 'generics', points: 2 },
        { keyword: 'utility types', points: 1 },
        { keyword: 'strict mode', points: 1 },
        { keyword: 'es6+', points: 1 },
        { keyword: 'async/await', points: 1 },
      ],
      penaltyKeywords: [
        { keyword: 'no typescript', points: -2 },
      ],
    },
    {
      name: 'CSS/Styling',
      description: 'Modern CSS, frameworks, and responsive design',
      maxPoints: 5,
      keywords: ['css', 'tailwind', 'styled-components', 'emotion', 'sass', 'scss', 'less'],
      bonusKeywords: [
        { keyword: 'tailwind', points: 2 },
        { keyword: 'css-in-js', points: 1 },
        { keyword: 'responsive', points: 1 },
        { keyword: 'grid', points: 0.5 },
        { keyword: 'flexbox', points: 0.5 },
        { keyword: 'animations', points: 0.5 },
      ],
    },
    {
      name: 'Testing',
      description: 'Unit, integration, and E2E testing experience',
      maxPoints: 4,
      keywords: ['test', 'testing', 'jest', 'vitest', 'cypress', 'playwright', 'react testing library'],
      bonusKeywords: [
        { keyword: 'jest', points: 1.5 },
        { keyword: 'cypress', points: 1.5 },
        { keyword: 'playwright', points: 1.5 },
        { keyword: 'vitest', points: 1.5 },
        { keyword: 'react testing library', points: 1 },
        { keyword: 'e2e', points: 1 },
      ],
    },
    {
      name: 'Build Tools & CI/CD',
      description: 'Modern build tools and deployment pipelines',
      maxPoints: 3,
      keywords: ['webpack', 'vite', 'turbopack', 'rollup', 'esbuild', 'ci/cd', 'github actions', 'gitlab ci'],
      bonusKeywords: [
        { keyword: 'vite', points: 1 },
        { keyword: 'github actions', points: 1 },
        { keyword: 'ci/cd', points: 1 },
      ],
    },
    {
      name: 'Version Control',
      description: 'Git and collaboration workflows',
      maxPoints: 2,
      requiredAny: ['git', 'github', 'gitlab'],
      bonusKeywords: [
        { keyword: 'pull request', points: 0.5 },
        { keyword: 'code review', points: 0.5 },
        { keyword: 'branching', points: 0.5 },
      ],
    },
    {
      name: 'Performance',
      description: 'Web performance optimization expertise',
      maxPoints: 1,
      keywords: ['performance', 'core web vitals', 'lighthouse', 'lazy loading', 'code splitting'],
    },
    {
      name: 'Bonus Skills',
      description: 'Advanced topics that boost score',
      maxPoints: 5,
      bonusKeywords: [
        { keyword: 'accessibility', points: 2 },
        { keyword: 'a11y', points: 2 },
        { keyword: 'wcag', points: 2 },
        { keyword: 'graphql', points: 1 },
        { keyword: 'redux', points: 1 },
        { keyword: 'zustand', points: 1 },
        { keyword: 'jotai', points: 1 },
        { keyword: 'monorepo', points: 1 },
        { keyword: 'turborepo', points: 1 },
      ],
      penaltyKeywords: [
        { keyword: 'jquery', points: -3 }, // If primary framework
        { keyword: 'backbone', points: -2 },
      ],
    },
  ],

  // EXPERIENCE QUALITY RULES (25 points max)
  experienceRules: [
    {
      name: 'Years of Experience',
      description: 'Total years in front-end development',
      maxPoints: 15,
      // Scoring logic:
      // 7+ years = 15 pts
      // 5-6 years = 13 pts
      // 3-4 years = 10 pts
      // 1-2 years = 6 pts
      // <1 year = 3 pts
    },
    {
      name: 'Seniority Level',
      description: 'Role level and progression',
      maxPoints: 5,
      bonusKeywords: [
        { keyword: 'senior', points: 2 },
        { keyword: 'lead', points: 3 },
        { keyword: 'staff', points: 3 },
        { keyword: 'principal', points: 4 },
      ],
      penaltyKeywords: [
        { keyword: 'junior', points: -2 }, // If 3+ years
      ],
    },
    {
      name: 'Company Caliber',
      description: 'Quality of companies worked at',
      maxPoints: 10,
      // Tier 1 (FAANG) = 10 pts
      // Tier 2 (Tech) = 8 pts
      // Tier 3 (Product) = 6 pts
      // Tier 4 (Agency) = 4 pts
      // Tier 5 (Unknown) = 2 pts
    },
  ],

  // IMPACT INDICATORS RULES (20 points max)
  impactRules: [
    {
      name: 'Quantified Metrics',
      description: 'Measurable achievements with numbers',
      maxPoints: 8,
      patterns: [
        /\d+%/g, // "45% improvement"
        /\d+x/g, // "3x faster"
        /\d+[km]?\s*(users?|customers?)/gi, // "100K users"
        /\$\d+/g, // "$50K saved"
      ],
      // 4+ metrics = 8 pts
      // 2-3 metrics = 6 pts
      // 1 metric = 4 pts
      // Vague claims = 2 pts
    },
    {
      name: 'Leadership Signals',
      description: 'Team leadership and mentoring',
      maxPoints: 6,
      keywords: ['led', 'lead', 'mentored', 'managed', 'architected', 'designed'],
      bonusKeywords: [
        { keyword: 'led team', points: 3 },
        { keyword: 'mentored', points: 2 },
        { keyword: 'architected', points: 2 },
      ],
    },
    {
      name: 'Innovation',
      description: 'Built tools, libraries, or solved novel problems',
      maxPoints: 6,
      keywords: ['built', 'created', 'developed', 'tool', 'library', 'framework', 'optimized'],
      bonusKeywords: [
        { keyword: 'built tool', points: 3 },
        { keyword: 'built library', points: 3 },
        { keyword: 'component library', points: 2 },
        { keyword: 'design system', points: 2 },
      ],
    },
  ],

  // PORTFOLIO LINKS RULES (15 points max)
  portfolioRules: [
    {
      name: 'GitHub Presence',
      description: 'GitHub profile with activity',
      maxPoints: 5,
      patterns: [/github\.com\/[\w-]+/gi],
    },
    {
      name: 'Portfolio Website',
      description: 'Personal portfolio or website',
      maxPoints: 5,
      patterns: [/https?:\/\/(www\.)?[\w-]+\.(com|dev|io|net|org)/gi],
    },
    {
      name: 'LinkedIn',
      description: 'LinkedIn profile',
      maxPoints: 2,
      patterns: [/linkedin\.com\/in\/[\w-]+/gi],
    },
    {
      name: 'Live Projects',
      description: 'Deployed applications or demos',
      maxPoints: 3,
      keywords: ['deployed', 'live', 'production', 'demo'],
    },
  ],

  // FOUNDATION RULES (5 points max)
  foundationRules: [
    {
      name: 'Education',
      description: 'Formal education background',
      maxPoints: 2,
      keywords: ['bs', 'ms', 'bachelor', 'master', 'computer science', 'bootcamp', 'self-taught'],
      bonusKeywords: [
        { keyword: 'computer science', points: 2 },
        { keyword: 'software engineering', points: 2 },
        { keyword: 'bootcamp', points: 1 },
      ],
    },
    {
      name: 'Continuous Learning',
      description: 'Recent courses, certifications, or conferences',
      maxPoints: 3,
      keywords: ['certification', 'course', 'conference', 'speaker', 'talk', 'blog'],
      bonusKeywords: [
        { keyword: '2024', points: 1.5 },
        { keyword: '2023', points: 1 },
        { keyword: 'certification', points: 1 },
        { keyword: 'speaker', points: 1.5 },
      ],
    },
  ],

  // KEYWORD DICTIONARIES
  requiredKeywords: ['react', 'vue', 'angular', 'javascript'],
  bonusKeywords: ['typescript', 'testing', 'accessibility', 'performance'],
  penaltyKeywords: ['jquery', 'backbone'],

  // COMPANY TIERS
  companyTiers: {
    tier1: [
      'google', 'meta', 'facebook', 'apple', 'amazon', 'netflix', 'microsoft',
      'stripe', 'airbnb', 'uber', 'lyft', 'doordash', 'coinbase', 'square',
      'salesforce', 'oracle', 'adobe', 'intuit', 'paypal', 'tesla',
    ],
    tier2: [
      'shopify', 'spotify', 'slack', 'atlassian', 'dropbox', 'github',
      'gitlab', 'twilio', 'okta', 'datadog', 'mongodb', 'elastic',
      'reddit', 'pinterest', 'snap', 'twitter', 'linkedin',
    ],
    tier3: [
      'walmart', 'target', 'nike', 'adidas', 'starbucks', 'chipotle',
      'marriott', 'hilton', 'delta', 'southwest', 'fedex', 'ups',
      'bank of america', 'wells fargo', 'chase', 'capital one',
    ],
    tier4: [
      'accenture', 'deloitte', 'pwc', 'ey', 'cognizant', 'infosys',
      'thoughtworks', 'pivotal', 'ideo', 'frog',
    ],
  },

  // DECISION THRESHOLDS
  thresholds: {
    exceptional: 85, // Fast-track to onsite
    strong: 70, // Phone screen
    potential: 55, // Review portfolio first
    marginal: 40, // Pass unless niche match
  },

  // METADATA
  createdAt: new Date('2025-01-15'),
  updatedAt: new Date('2025-01-15'),
  createdBy: 'system',
  isDefault: true,
};

/**
 * Get all available scoring profiles
 */
export function getScoringProfiles(): ScoringProfile[] {
  return [
    FRONTEND_DEVELOPER_SENIOR,
    // Future profiles: FULLSTACK_ENGINEER, UI_UX_DESIGNER, etc.
  ];
}

/**
 * Get a scoring profile by ID
 */
export function getScoringProfileById(id: string): ScoringProfile | undefined {
  return getScoringProfiles().find(profile => profile.id === id);
}

/**
 * Get the default scoring profile
 */
export function getDefaultScoringProfile(): ScoringProfile {
  return FRONTEND_DEVELOPER_SENIOR;
}
