/**
 * Resume scoring engine
 * Implements the automated Pass 1 scoring rubric
 */

import { ParsedResume } from '@/types/resume';
import {
  ScoringProfile,
  ScoreResult,
  CategoryScore,
  SubcategoryScore,
  Verdict,
  VerdictThresholds,
  KeywordMatch,
  ScoringRule,
} from '@/types/scoring';
import { matchKeywords, hasAnyKeyword, hasAllKeywords, countKeywords, extractMatchedKeywords } from './keyword-matcher';

/**
 * Main scoring function - scores a parsed resume against a scoring profile
 * @param parsedResume - The parsed resume data
 * @param profile - The scoring profile to use
 * @returns Complete ScoreResult with breakdown
 */
export function scoreResume(parsedResume: ParsedResume, profile: ScoringProfile): ScoreResult {
  // Score each category
  const technical = scoreTechnicalSkills(parsedResume, profile);
  const experience = scoreExperience(parsedResume, profile);
  const impact = scoreImpact(parsedResume, profile);
  const portfolio = scorePortfolio(parsedResume, profile);
  const foundation = scoreFoundation(parsedResume, profile);

  // Calculate total score
  const totalScore = Math.min(
    100,
    technical.score + experience.score + impact.score + portfolio.score + foundation.score
  );

  // Determine verdict
  const verdict = determineVerdict(totalScore, profile.thresholds);
  const verdictDetails = getVerdictDetails(verdict);

  // Generate strengths and concerns
  const strengths = generateStrengths(parsedResume, { technical, experience, impact, portfolio, foundation });
  const concerns = generateConcerns(parsedResume, { technical, experience, impact, portfolio, foundation });

  return {
    candidateId: parsedResume.email || parsedResume.name,
    resumeFileName: parsedResume.fileName,
    totalScore: Math.round(totalScore * 10) / 10,
    verdict,
    verdictLabel: verdictDetails.label,
    verdictAction: verdictDetails.action,
    verdictEmoji: verdictDetails.emoji,
    breakdown: {
      technical,
      experience,
      impact,
      portfolio,
      foundation,
    },
    strengths,
    concerns,
    extractedData: parsedResume,
    profileUsed: profile.id,
    scoredAt: new Date(),
    scoredBy: 'automated-pass1',
  };
}

/**
 * Score technical skills (35 points max)
 */
function scoreTechnicalSkills(resume: ParsedResume, profile: ScoringProfile): CategoryScore {
  const subcategories: SubcategoryScore[] = [];
  const text = resume.rawText.toLowerCase();

  for (const rule of profile.technicalRules) {
    const subcategory = scoreRule(text, rule, resume);
    subcategories.push(subcategory);
  }

  const totalScore = subcategories.reduce((sum, sub) => sum + sub.score, 0);
  const maxScore = profile.technicalRules.reduce((sum, rule) => sum + rule.maxPoints, 0);

  return {
    categoryName: 'Technical Skills',
    score: Math.min(totalScore, maxScore),
    maxScore,
    percentage: (totalScore / maxScore) * 100,
    subcategories,
  };
}

/**
 * Score experience quality (25 points max)
 */
function scoreExperience(resume: ParsedResume, profile: ScoringProfile): CategoryScore {
  const subcategories: SubcategoryScore[] = [];
  const text = resume.rawText.toLowerCase();
  const years = resume.totalYearsExperience || 0;

  for (const rule of profile.experienceRules) {
    if (rule.name === 'Years of Experience') {
      // Special handling for years calculation
      const subcategory = scoreYearsOfExperience(years, rule);
      subcategories.push(subcategory);
    } else if (rule.name === 'Company Caliber') {
      // Special handling for company tier matching
      const subcategory = scoreCompanyCalibur(resume, profile, rule);
      subcategories.push(subcategory);
    } else {
      // Standard rule scoring
      const subcategory = scoreRule(text, rule, resume);
      subcategories.push(subcategory);
    }
  }

  const totalScore = subcategories.reduce((sum, sub) => sum + sub.score, 0);
  const maxScore = profile.experienceRules.reduce((sum, rule) => sum + rule.maxPoints, 0);

  return {
    categoryName: 'Experience',
    score: Math.min(totalScore, maxScore),
    maxScore,
    percentage: (totalScore / maxScore) * 100,
    subcategories,
  };
}

/**
 * Score impact indicators (20 points max)
 */
function scoreImpact(resume: ParsedResume, profile: ScoringProfile): CategoryScore {
  const subcategories: SubcategoryScore[] = [];
  const text = resume.rawText.toLowerCase();

  for (const rule of profile.impactRules) {
    if (rule.name === 'Quantified Metrics') {
      // Special handling for metrics
      const subcategory = scoreMetrics(resume, rule);
      subcategories.push(subcategory);
    } else {
      // Standard rule scoring
      const subcategory = scoreRule(text, rule, resume);
      subcategories.push(subcategory);
    }
  }

  const totalScore = subcategories.reduce((sum, sub) => sum + sub.score, 0);
  const maxScore = profile.impactRules.reduce((sum, rule) => sum + rule.maxPoints, 0);

  return {
    categoryName: 'Impact',
    score: Math.min(totalScore, maxScore),
    maxScore,
    percentage: (totalScore / maxScore) * 100,
    subcategories,
  };
}

/**
 * Score portfolio links (15 points max)
 */
function scorePortfolio(resume: ParsedResume, profile: ScoringProfile): CategoryScore {
  const subcategories: SubcategoryScore[] = [];
  const links = resume.links;

  for (const rule of profile.portfolioRules) {
    let score = 0;
    const matched: string[] = [];
    let reasoning = '';

    if (rule.name === 'GitHub Presence' && links.github) {
      score = rule.maxPoints;
      matched.push(links.github);
      reasoning = 'GitHub profile found';
    } else if (rule.name === 'Portfolio Website' && links.portfolio) {
      score = rule.maxPoints;
      matched.push(links.portfolio);
      reasoning = 'Portfolio website found';
    } else if (rule.name === 'LinkedIn' && links.linkedin) {
      score = rule.maxPoints;
      matched.push(links.linkedin);
      reasoning = 'LinkedIn profile found';
    } else if (rule.name === 'Live Projects') {
      // Check for keywords in text
      const keywords = rule.keywords || [];
      const found = extractMatchedKeywords(resume.rawText, keywords);
      if (found.length > 0) {
        score = Math.min(rule.maxPoints, found.length * 1.5);
        matched.push(...found);
        reasoning = `Found ${found.length} project indicator(s)`;
      }
    }

    subcategories.push({
      name: rule.name,
      score: Math.min(score, rule.maxPoints),
      maxScore: rule.maxPoints,
      percentage: (score / rule.maxPoints) * 100,
      matched,
      reasoning: reasoning || 'Not found',
    });
  }

  const totalScore = subcategories.reduce((sum, sub) => sum + sub.score, 0);
  const maxScore = profile.portfolioRules.reduce((sum, rule) => sum + rule.maxPoints, 0);

  return {
    categoryName: 'Portfolio',
    score: Math.min(totalScore, maxScore),
    maxScore,
    percentage: (totalScore / maxScore) * 100,
    subcategories,
  };
}

/**
 * Score foundation/education (5 points max)
 */
function scoreFoundation(resume: ParsedResume, profile: ScoringProfile): CategoryScore {
  const subcategories: SubcategoryScore[] = [];
  const text = resume.rawText.toLowerCase();

  for (const rule of profile.foundationRules) {
    const subcategory = scoreRule(text, rule, resume);
    subcategories.push(subcategory);
  }

  const totalScore = subcategories.reduce((sum, sub) => sum + sub.score, 0);
  const maxScore = profile.foundationRules.reduce((sum, rule) => sum + rule.maxPoints, 0);

  return {
    categoryName: 'Foundation',
    score: Math.min(totalScore, maxScore),
    maxScore,
    percentage: (totalScore / maxScore) * 100,
    subcategories,
  };
}

/**
 * Score a generic rule
 */
function scoreRule(text: string, rule: ScoringRule, resume: ParsedResume): SubcategoryScore {
  let score = 0;
  const matched: string[] = [];
  let keywordMatches: KeywordMatch[] = [];

  // Check required keywords
  if (rule.requiredAll && hasAllKeywords(text, rule.requiredAll)) {
    score += rule.maxPoints * 0.5;
    matched.push(...rule.requiredAll);
  }

  if (rule.requiredAny && hasAnyKeyword(text, rule.requiredAny)) {
    score += rule.maxPoints * 0.3;
    matched.push(...extractMatchedKeywords(text, rule.requiredAny));
  }

  // Check standard keywords
  if (rule.keywords) {
    const found = extractMatchedKeywords(text, rule.keywords);
    if (found.length > 0) {
      score += Math.min(rule.maxPoints * 0.4, found.length * (rule.maxPoints / rule.keywords.length));
      matched.push(...found);
      keywordMatches = matchKeywords(text, found);
    }
  }

  // Apply bonus keywords
  if (rule.bonusKeywords) {
    for (const bonus of rule.bonusKeywords) {
      if (text.includes(bonus.keyword.toLowerCase())) {
        score += bonus.points;
        matched.push(bonus.keyword);
      }
    }
  }

  // Apply penalty keywords
  if (rule.penaltyKeywords) {
    for (const penalty of rule.penaltyKeywords) {
      if (text.includes(penalty.keyword.toLowerCase())) {
        score += penalty.points; // Already negative
        matched.push(`-${penalty.keyword}`);
      }
    }
  }

  // Cap at max points
  score = Math.max(0, Math.min(score, rule.maxPoints));

  return {
    name: rule.name,
    score: Math.round(score * 10) / 10,
    maxScore: rule.maxPoints,
    percentage: (score / rule.maxPoints) * 100,
    matched,
    reasoning: generateReasoning(rule, matched, score),
    keywordMatches: keywordMatches.length > 0 ? keywordMatches : undefined,
  };
}

/**
 * Score years of experience
 */
function scoreYearsOfExperience(years: number, rule: ScoringRule): SubcategoryScore {
  let score = 0;
  let reasoning = '';

  if (years >= 7) {
    score = 15;
    reasoning = `${years}+ years (senior level)`;
  } else if (years >= 5) {
    score = 13;
    reasoning = `${years} years (mid-senior level)`;
  } else if (years >= 3) {
    score = 10;
    reasoning = `${years} years (mid level)`;
  } else if (years >= 1) {
    score = 6;
    reasoning = `${years} years (junior-mid level)`;
  } else {
    score = 3;
    reasoning = `${years} years (entry level)`;
  }

  return {
    name: rule.name,
    score: Math.min(score, rule.maxPoints),
    maxScore: rule.maxPoints,
    percentage: (score / rule.maxPoints) * 100,
    matched: [years.toString()],
    reasoning,
  };
}

/**
 * Score company caliber based on tier matching
 */
function scoreCompanyCalibur(resume: ParsedResume, profile: ScoringProfile, rule: ScoringRule): SubcategoryScore {
  const companies = resume.experience.map(exp => exp.company.toLowerCase());
  const tiers = profile.companyTiers;

  let score = 2; // Default for unknown
  const matched: string[] = [];
  let tier = 'unknown';

  // Check tier 1 (FAANG, unicorns)
  for (const company of companies) {
    if (tiers.tier1.some(t1 => company.includes(t1.toLowerCase()))) {
      score = 10;
      tier = 'tier1';
      matched.push(company);
      break;
    }
  }

  // Check tier 2
  if (score === 2) {
    for (const company of companies) {
      if (tiers.tier2.some(t2 => company.includes(t2.toLowerCase()))) {
        score = 8;
        tier = 'tier2';
        matched.push(company);
        break;
      }
    }
  }

  // Check tier 3
  if (score === 2) {
    for (const company of companies) {
      if (tiers.tier3.some(t3 => company.includes(t3.toLowerCase()))) {
        score = 6;
        tier = 'tier3';
        matched.push(company);
        break;
      }
    }
  }

  // Check tier 4
  if (score === 2) {
    for (const company of companies) {
      if (tiers.tier4.some(t4 => company.includes(t4.toLowerCase()))) {
        score = 4;
        tier = 'tier4';
        matched.push(company);
        break;
      }
    }
  }

  const reasoning = tier === 'unknown'
    ? 'No recognized companies found'
    : `Worked at ${tier.toUpperCase()} company`;

  return {
    name: rule.name,
    score: Math.min(score, rule.maxPoints),
    maxScore: rule.maxPoints,
    percentage: (score / rule.maxPoints) * 100,
    matched: matched.length > 0 ? matched : companies.slice(0, 2),
    reasoning,
  };
}

/**
 * Score metrics found in resume
 */
function scoreMetrics(resume: ParsedResume, rule: ScoringRule): SubcategoryScore {
  const metricsCount = resume.metrics.length;
  let score = 0;
  let reasoning = '';

  if (metricsCount >= 4) {
    score = 8;
    reasoning = `${metricsCount} quantified metrics (excellent)`;
  } else if (metricsCount >= 2) {
    score = 6;
    reasoning = `${metricsCount} quantified metrics (good)`;
  } else if (metricsCount >= 1) {
    score = 4;
    reasoning = `${metricsCount} quantified metric (fair)`;
  } else {
    score = 2;
    reasoning = 'No quantified metrics found';
  }

  return {
    name: rule.name,
    score: Math.min(score, rule.maxPoints),
    maxScore: rule.maxPoints,
    percentage: (score / rule.maxPoints) * 100,
    matched: resume.metrics.slice(0, 5).map(m => m.text),
    reasoning,
  };
}

/**
 * Generate reasoning text for a rule
 */
function generateReasoning(rule: ScoringRule, matched: string[], score: number): string {
  if (matched.length === 0) {
    return `No ${rule.name.toLowerCase()} found`;
  }

  const percentage = (score / rule.maxPoints) * 100;
  const level = percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : percentage >= 40 ? 'Fair' : 'Basic';

  return `${level}: ${matched.slice(0, 3).join(', ')}${matched.length > 3 ? ` +${matched.length - 3} more` : ''}`;
}

/**
 * Determine verdict based on total score
 */
function determineVerdict(totalScore: number, thresholds: VerdictThresholds): Verdict {
  if (totalScore >= thresholds.exceptional) return 'exceptional';
  if (totalScore >= thresholds.strong) return 'strong';
  if (totalScore >= thresholds.potential) return 'potential';
  if (totalScore >= thresholds.marginal) return 'marginal';
  return 'pass';
}

/**
 * Get verdict label, action, and emoji
 */
function getVerdictDetails(verdict: Verdict): { label: string; action: string; emoji: string } {
  const details = {
    exceptional: {
      label: 'Exceptional Candidate',
      action: 'Fast-track to onsite',
      emoji: '🟢',
    },
    strong: {
      label: 'Strong Candidate',
      action: 'Phone screen',
      emoji: '🟡',
    },
    potential: {
      label: 'Potential Candidate',
      action: 'Review portfolio first',
      emoji: '🟠',
    },
    marginal: {
      label: 'Marginal Candidate',
      action: 'Pass unless niche match',
      emoji: '🔴',
    },
    pass: {
      label: 'Pass',
      action: 'Decline',
      emoji: '⚫',
    },
  };

  return details[verdict];
}

/**
 * Generate strengths array
 */
function generateStrengths(
  resume: ParsedResume,
  breakdown: { technical: CategoryScore; experience: CategoryScore; impact: CategoryScore; portfolio: CategoryScore; foundation: CategoryScore }
): string[] {
  const strengths: string[] = [];

  // Check technical strengths
  if (breakdown.technical.percentage >= 70) {
    const topSkills = breakdown.technical.subcategories
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .filter(s => s.score > 0)
      .map(s => s.name);
    if (topSkills.length > 0) {
      strengths.push(`Strong technical skills: ${topSkills.join(', ')}`);
    }
  }

  // Check experience
  if (resume.totalYearsExperience && resume.totalYearsExperience >= 5) {
    strengths.push(`${resume.totalYearsExperience}+ years of experience`);
  }

  // Check company caliber
  const companyScore = breakdown.experience.subcategories.find(s => s.name === 'Company Caliber');
  if (companyScore && companyScore.score >= 8) {
    strengths.push(`Experience at top-tier companies`);
  }

  // Check impact
  if (resume.metrics.length >= 3) {
    strengths.push(`${resume.metrics.length} quantified achievements`);
  }

  // Check portfolio
  if (resume.links.github && resume.links.portfolio) {
    strengths.push('Active GitHub and portfolio presence');
  } else if (resume.links.github) {
    strengths.push('Active GitHub profile');
  }

  // Check leadership
  const leadershipScore = breakdown.impact.subcategories.find(s => s.name === 'Leadership Signals');
  if (leadershipScore && leadershipScore.score >= 4) {
    strengths.push('Demonstrated leadership experience');
  }

  return strengths.slice(0, 5); // Top 5 strengths
}

/**
 * Generate concerns array
 */
function generateConcerns(
  resume: ParsedResume,
  breakdown: { technical: CategoryScore; experience: CategoryScore; impact: CategoryScore; portfolio: CategoryScore; foundation: CategoryScore }
): string[] {
  const concerns: string[] = [];

  // Check technical gaps
  if (breakdown.technical.percentage < 50) {
    concerns.push('Technical skills below expectations');
  }

  // Check experience
  if (!resume.totalYearsExperience || resume.totalYearsExperience < 3) {
    concerns.push('Limited professional experience');
  }

  // Check metrics
  if (resume.metrics.length === 0) {
    concerns.push('No quantified achievements or metrics');
  }

  // Check portfolio
  if (!resume.links.github && !resume.links.portfolio) {
    concerns.push('No GitHub or portfolio links provided');
  }

  // Check TypeScript
  const hasTypeScript = resume.rawText.toLowerCase().includes('typescript');
  if (!hasTypeScript) {
    concerns.push('No TypeScript experience mentioned');
  }

  // Check testing
  const testingScore = breakdown.technical.subcategories.find(s => s.name === 'Testing');
  if (testingScore && testingScore.score < 2) {
    concerns.push('Limited testing experience');
  }

  return concerns.slice(0, 5); // Top 5 concerns
}
