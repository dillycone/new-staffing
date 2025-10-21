/**
 * Scoring system types and interfaces
 */

import { ParsedResume } from './resume';

export type Verdict = 'exceptional' | 'strong' | 'potential' | 'marginal' | 'pass';

export interface VerdictThresholds {
  exceptional: number; // 85+
  strong: number; // 70+
  potential: number; // 55+
  marginal: number; // 40+
  // Below marginal = pass
}

export interface KeywordMatch {
  keyword: string;
  occurrences: number;
  lineNumbers: number[];
  contexts: string[]; // Surrounding text snippets
}

export interface SubcategoryScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  matched: string[]; // Keywords/patterns that matched
  reasoning: string; // Why this score was given
  keywordMatches?: KeywordMatch[];
}

export interface CategoryScore {
  categoryName: string;
  score: number;
  maxScore: number;
  percentage: number;
  subcategories: SubcategoryScore[];
}

export interface ScoreBreakdown {
  technical: CategoryScore;
  experience: CategoryScore;
  impact: CategoryScore;
  portfolio: CategoryScore;
  foundation: CategoryScore;
}

export interface ScoreResult {
  // Identification
  candidateId: string;
  resumeFileName: string;

  // Overall Score
  totalScore: number; // 0-100
  verdict: Verdict;
  verdictLabel: string; // "Strong Candidate"
  verdictAction: string; // "Phone Screen"
  verdictEmoji: string; // "🟡"

  // Detailed Breakdown
  breakdown: ScoreBreakdown;

  // Analysis
  strengths: string[]; // Key positive points
  concerns: string[]; // Areas to probe or red flags

  // Reference Data
  extractedData: ParsedResume;
  profileUsed: string; // Profile ID/name

  // Metadata
  scoredAt: Date;
  scoredBy: 'automated-pass1' | 'human-pass2';
}

export interface ScoringRule {
  name: string;
  description: string;
  maxPoints: number;
  keywords?: string[]; // Keywords that trigger points
  patterns?: RegExp[]; // Regex patterns to match
  requiredAll?: string[]; // All must be present
  requiredAny?: string[]; // At least one must be present
  bonusKeywords?: { keyword: string; points: number }[];
  penaltyKeywords?: { keyword: string; points: number }[];
}

export interface CategoryWeights {
  technical: number; // 0-1 (e.g., 0.35 = 35%)
  experience: number;
  impact: number;
  portfolio: number;
  foundation: number;
}

export interface ScoringProfile {
  id: string;
  name: string;
  description: string;
  roleType: string; // "Front-End Developer", "Full-Stack", etc.

  // Category Configuration
  weights: CategoryWeights;

  // Scoring Rules per Category
  technicalRules: ScoringRule[];
  experienceRules: ScoringRule[];
  impactRules: ScoringRule[];
  portfolioRules: ScoringRule[];
  foundationRules: ScoringRule[];

  // Keyword Dictionaries
  requiredKeywords: string[]; // Must have at least one
  bonusKeywords: string[]; // Nice to have
  penaltyKeywords: string[]; // Red flags

  // Company Tiers (for experience scoring)
  companyTiers: {
    tier1: string[]; // FAANG, unicorns
    tier2: string[]; // Established tech
    tier3: string[]; // Product companies
    tier4: string[]; // Agencies
  };

  // Thresholds
  thresholds: VerdictThresholds;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isDefault: boolean;
}

export interface ScoringSession {
  id: string;
  profileId: string;
  resumeIds: string[];
  results: ScoreResult[];
  status: 'pending' | 'processing' | 'completed' | 'error';
  createdAt: Date;
  completedAt?: Date;
}
