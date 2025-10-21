/**
 * Scoring engine for candidate evaluation
 * Implements weighted scoring across multiple categories
 */

import { ScoringProfile, defaultProfile } from './scoring-profiles';

export interface CategoryScore {
  score: number;
  maxPoints: number;
  breakdown: Record<string, number>;
}

export interface CandidateScore {
  totalScore: number;
  technical: CategoryScore;
  experience: CategoryScore;
  impact: CategoryScore;
  portfolio: CategoryScore;
  foundation: CategoryScore;
  profile: ScoringProfile;
}

/**
 * Score technical skills category
 * Max points: 40 (frameworks: 15, languages: 15, tools: 10)
 */
function scoreTechnical(candidate: any): CategoryScore {
  const breakdown: Record<string, number> = {};

  // Frameworks (max 15)
  const frameworks = candidate.frameworks || [];
  breakdown.frameworks = Math.min(15, frameworks.length * 3);

  // Languages (max 15)
  const languages = candidate.languages || [];
  breakdown.languages = Math.min(15, languages.length * 3);

  // Tools (max 10)
  const tools = candidate.tools || [];
  breakdown.tools = Math.min(10, tools.length * 2);

  const score = breakdown.frameworks + breakdown.languages + breakdown.tools;

  return {
    score,
    maxPoints: 40,
    breakdown,
  };
}

/**
 * Score experience category
 * Max points: 25 (years: 15, level: 10)
 */
function scoreExperience(candidate: any): CategoryScore {
  const breakdown: Record<string, number> = {};

  // Years of experience (max 15)
  const years = candidate.yearsOfExperience || 0;
  breakdown.years = Math.min(15, years * 1.5);

  // Role level (max 10)
  const level = candidate.level || 'junior';
  const levelScores: Record<string, number> = {
    junior: 3,
    mid: 6,
    senior: 8,
    lead: 10,
    principal: 10,
  };
  breakdown.level = levelScores[level] || 3;

  const score = breakdown.years + breakdown.level;

  return {
    score,
    maxPoints: 25,
    breakdown,
  };
}

/**
 * Score business impact category
 * Max points: 30 (achievements: 20, metrics: 10)
 */
function scoreImpact(candidate: any): CategoryScore {
  const breakdown: Record<string, number> = {};

  // Achievements (max 20)
  const achievements = candidate.achievements || [];
  breakdown.achievements = Math.min(20, achievements.length * 4);

  // Measurable metrics (max 10)
  const metrics = candidate.metrics || [];
  breakdown.metrics = Math.min(10, metrics.length * 2.5);

  const score = breakdown.achievements + breakdown.metrics;

  return {
    score,
    maxPoints: 30,
    breakdown,
  };
}

/**
 * Score portfolio category
 * Max points: 20 (projects: 15, quality: 5)
 */
function scorePortfolio(candidate: any): CategoryScore {
  const breakdown: Record<string, number> = {};

  // Projects (max 15)
  const projects = candidate.projects || [];
  breakdown.projects = Math.min(15, projects.length * 5);

  // Quality indicators (max 5)
  const hasGithub = candidate.github ? 2 : 0;
  const hasLiveProjects = candidate.liveProjects ? 3 : 0;
  breakdown.quality = hasGithub + hasLiveProjects;

  const score = breakdown.projects + breakdown.quality;

  return {
    score,
    maxPoints: 20,
    breakdown,
  };
}

/**
 * Score foundation category
 * Max points: 10 (education: 6, certifications: 4)
 */
function scoreFoundation(candidate: any): CategoryScore {
  const breakdown: Record<string, number> = {};

  // Education (max 6)
  const education = candidate.education || 'none';
  const educationScores: Record<string, number> = {
    none: 0,
    bootcamp: 3,
    associate: 4,
    bachelor: 5,
    master: 6,
    phd: 6,
  };
  breakdown.education = educationScores[education] || 0;

  // Certifications (max 4)
  const certifications = candidate.certifications || [];
  breakdown.certifications = Math.min(4, certifications.length * 2);

  const score = breakdown.education + breakdown.certifications;

  return {
    score,
    maxPoints: 10,
    breakdown,
  };
}

/**
 * Score company caliber
 * Returns a multiplier based on company tier
 */
function scoreCompanyCaliber(candidate: any): number {
  const company = candidate.company || '';
  const tier = candidate.companyTier || 'unknown';

  const tierMultipliers: Record<string, number> = {
    faang: 1.15,      // 15% bonus
    unicorn: 1.10,    // 10% bonus
    established: 1.05, // 5% bonus
    startup: 1.0,     // No bonus
    unknown: 1.0,     // No bonus
  };

  return tierMultipliers[tier] || 1.0;
}

/**
 * Calculate weighted total score for a candidate
 *
 * @param candidate - Candidate data object
 * @param profile - Scoring profile to use (defaults to balanced profile)
 * @returns Complete scoring breakdown with weighted total
 */
export function scoreCandidate(
  candidate: any,
  profile: ScoringProfile = defaultProfile
): CandidateScore {
  // Calculate raw category scores
  const technical = scoreTechnical(candidate);
  const experience = scoreExperience(candidate);
  const impact = scoreImpact(candidate);
  const portfolio = scorePortfolio(candidate);
  const foundation = scoreFoundation(candidate);

  // Calculate percentage earned in each category (0-100)
  const technicalPct = (technical.score / technical.maxPoints) * 100;
  const experiencePct = (experience.score / experience.maxPoints) * 100;
  const impactPct = (impact.score / impact.maxPoints) * 100;
  const portfolioPct = (portfolio.score / portfolio.maxPoints) * 100;
  const foundationPct = (foundation.score / foundation.maxPoints) * 100;

  // Apply category weights from profile
  const weightedScore =
    (technicalPct * profile.weights.technical) +
    (experiencePct * profile.weights.experience) +
    (impactPct * profile.weights.impact) +
    (portfolioPct * profile.weights.portfolio) +
    (foundationPct * profile.weights.foundation);

  // Apply company caliber multiplier
  const caliberMultiplier = scoreCompanyCaliber(candidate);
  const totalScore = Math.min(100, weightedScore * caliberMultiplier);

  return {
    totalScore: Math.round(totalScore * 10) / 10, // Round to 1 decimal
    technical,
    experience,
    impact,
    portfolio,
    foundation,
    profile,
  };
}

/**
 * Batch score multiple candidates
 */
export function scoreCandidates(
  candidates: any[],
  profile: ScoringProfile = defaultProfile
): CandidateScore[] {
  return candidates.map(candidate => scoreCandidate(candidate, profile));
}

/**
 * Rank candidates by score
 */
export function rankCandidates(
  candidates: any[],
  profile: ScoringProfile = defaultProfile
): Array<{ candidate: any; score: CandidateScore; rank: number }> {
  const scored = candidates.map(candidate => ({
    candidate,
    score: scoreCandidate(candidate, profile),
  }));

  // Sort by total score descending
  scored.sort((a, b) => b.score.totalScore - a.score.totalScore);

  // Add rank
  return scored.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}
