/**
 * Scoring profiles define category weights for different candidate evaluation scenarios
 */

export interface ScoringProfile {
  name: string;
  description: string;
  weights: {
    technical: number;    // 0-1, percentage as decimal
    experience: number;   // 0-1, percentage as decimal
    impact: number;       // 0-1, percentage as decimal
    portfolio: number;    // 0-1, percentage as decimal
    foundation: number;   // 0-1, percentage as decimal
  };
}

/**
 * Default balanced profile
 * Technical skills are weighted highest, followed by experience
 */
export const defaultProfile: ScoringProfile = {
  name: 'Default',
  description: 'Balanced evaluation across all categories',
  weights: {
    technical: 0.35,    // 35% - Technical skills (frameworks, languages, tools)
    experience: 0.25,   // 25% - Years of experience and role level
    impact: 0.20,       // 20% - Business impact and achievements
    portfolio: 0.15,    // 15% - Portfolio quality and projects
    foundation: 0.05,   // 5% - Education and certifications
  },
};

/**
 * Senior role profile
 * Emphasizes experience and impact over raw technical skills
 */
export const seniorProfile: ScoringProfile = {
  name: 'Senior',
  description: 'Optimized for senior and leadership roles',
  weights: {
    technical: 0.25,    // 25%
    experience: 0.30,   // 30%
    impact: 0.30,       // 30%
    portfolio: 0.10,    // 10%
    foundation: 0.05,   // 5%
  },
};

/**
 * Junior role profile
 * Emphasizes technical skills and foundation over experience
 */
export const juniorProfile: ScoringProfile = {
  name: 'Junior',
  description: 'Optimized for junior and entry-level roles',
  weights: {
    technical: 0.40,    // 40%
    experience: 0.10,   // 10%
    impact: 0.15,       // 15%
    portfolio: 0.20,    // 20%
    foundation: 0.15,   // 15%
  },
};

export const profiles = {
  default: defaultProfile,
  senior: seniorProfile,
  junior: juniorProfile,
};

/**
 * Get all available scoring profiles with metadata
 */
export function getScoringProfiles() {
  return [
    { id: 'default', ...defaultProfile, isDefault: true },
    { id: 'senior', ...seniorProfile, isDefault: false },
    { id: 'junior', ...juniorProfile, isDefault: false },
  ];
}
