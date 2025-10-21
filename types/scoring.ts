/**
 * Scoring domain types
 *
 * This module defines all types related to candidate scoring and evaluation.
 */

/**
 * Scoring profile that defines evaluation criteria and weights
 *
 * Re-exported from lib/scoring-profiles.ts for convenience
 */
export interface ScoringProfile {
  /** Profile name */
  name: string;
  /** Profile description */
  description: string;
  /** Category weights (must sum to 1.0) */
  weights: CategoryWeights;
}

/**
 * Category weights for scoring
 *
 * All weights are decimals between 0 and 1, representing percentages.
 * The sum of all weights should equal 1.0.
 */
export interface CategoryWeights {
  /** Technical skills weight (frameworks, languages, tools) */
  technical: number;
  /** Experience weight (years, role level) */
  experience: number;
  /** Impact weight (business achievements, quantifiable results) */
  impact: number;
  /** Portfolio weight (projects, quality of work) */
  portfolio: number;
  /** Foundation weight (education, certifications) */
  foundation: number;
}

/**
 * Overall scoring result for a candidate
 */
export interface ScoreResult {
  /** Unique identifier for this scoring result */
  id: string;
  /** Reference to the resume upload being scored */
  resumeId: string;
  /** Candidate name (from resume) */
  candidateName: string;
  /** Profile used for scoring */
  profileUsed: string;
  /** Overall composite score (0-100) */
  overallScore: number;
  /** Individual category scores */
  categoryScores: CategoryScores;
  /** Final verdict based on scoring */
  verdict: Verdict;
  /** Detailed reasoning for the verdict */
  reasoning: string;
  /** Strengths identified */
  strengths: string[];
  /** Areas for improvement or concerns */
  concerns: string[];
  /** Recommended next steps */
  recommendations: string[];
  /** Scoring timestamp */
  scoredAt: Date;
  /** Optional metadata */
  metadata?: ScoringMetadata;
}

/**
 * Individual category scores
 */
export interface CategoryScores {
  /** Technical skills score and details */
  technical: CategoryScore;
  /** Experience score and details */
  experience: CategoryScore;
  /** Impact score and details */
  impact: CategoryScore;
  /** Portfolio score and details */
  portfolio: CategoryScore;
  /** Foundation score and details */
  foundation: CategoryScore;
}

/**
 * Score details for a single category
 */
export interface CategoryScore {
  /** Raw score for this category (0-100) */
  score: number;
  /** Weighted contribution to overall score */
  weightedScore: number;
  /** Weight applied (from profile) */
  weight: number;
  /** Detailed findings for this category */
  findings: string[];
  /** Confidence level in this score */
  confidence?: 'low' | 'medium' | 'high';
}

/**
 * Final verdict for a candidate
 */
export type Verdict =
  | 'strong_match'      // Excellent fit, highly recommended
  | 'good_match'        // Good fit, recommended
  | 'moderate_match'    // Acceptable fit, consider with reservations
  | 'weak_match'        // Poor fit, not recommended
  | 'insufficient_data'; // Not enough information to make a determination

/**
 * Scoring metadata
 */
export interface ScoringMetadata {
  /** Engine version used for scoring */
  engineVersion?: string;
  /** Processing time in milliseconds */
  processingTime?: number;
  /** Model or algorithm used */
  model?: string;
  /** Confidence score in the overall result (0-1) */
  confidence?: number;
}

/**
 * Scoring progress information
 */
export interface ScoringProgress {
  /** Total number of resumes to score */
  total: number;
  /** Number of resumes completed */
  completed: number;
  /** Number of resumes in progress */
  inProgress: number;
  /** Number of resumes that failed */
  failed: number;
  /** Current resume being processed */
  currentResume?: string;
  /** Estimated time remaining in milliseconds */
  estimatedTimeRemaining?: number;
}

/**
 * Scoring statistics for analytics
 */
export interface ScoringStatistics {
  /** Total number of candidates scored */
  totalScored: number;
  /** Average overall score */
  averageScore: number;
  /** Score distribution by verdict */
  verdictDistribution: Record<Verdict, number>;
  /** Average scores by category */
  averageCategoryScores: {
    technical: number;
    experience: number;
    impact: number;
    portfolio: number;
    foundation: number;
  };
  /** Most commonly used profile */
  mostUsedProfile?: string;
}
