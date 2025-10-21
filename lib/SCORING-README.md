# Scoring Engine Documentation

## Overview

The scoring engine provides a flexible, weighted candidate evaluation system with multiple scoring profiles optimized for different role levels.

## Key Features

### 1. Weighted Scoring Calculation
Unlike simple additive scoring, this engine:
- Calculates percentage performance in each category (0-100%)
- Applies configurable weights to each category
- Supports different scoring profiles for different roles
- Includes company caliber multipliers

### 2. Five Evaluation Categories

| Category | Max Points | Default Weight | Components |
|----------|-----------|----------------|------------|
| **Technical** | 40 | 35% | Frameworks (15), Languages (15), Tools (10) |
| **Experience** | 25 | 25% | Years (15), Level (10) |
| **Impact** | 30 | 20% | Achievements (20), Metrics (10) |
| **Portfolio** | 20 | 15% | Projects (15), Quality (5) |
| **Foundation** | 10 | 5% | Education (6), Certifications (4) |

### 3. Scoring Profiles

#### Default Profile (Balanced)
```typescript
{
  technical: 0.35,    // 35%
  experience: 0.25,   // 25%
  impact: 0.20,       // 20%
  portfolio: 0.15,    // 15%
  foundation: 0.05,   // 5%
}
```

#### Senior Profile
```typescript
{
  technical: 0.25,    // 25%
  experience: 0.30,   // 30%
  impact: 0.30,       // 30%
  portfolio: 0.10,    // 10%
  foundation: 0.05,   // 5%
}
```

#### Junior Profile
```typescript
{
  technical: 0.40,    // 40%
  experience: 0.10,   // 10%
  impact: 0.15,       // 15%
  portfolio: 0.20,    // 20%
  foundation: 0.15,   // 15%
}
```

## How Weighted Scoring Works

### Step 1: Calculate Raw Category Scores
Each category has specific max points based on its components:
```typescript
Technical: 40 points (frameworks: 15, languages: 15, tools: 10)
Experience: 25 points (years: 15, level: 10)
Impact: 30 points (achievements: 20, metrics: 10)
Portfolio: 20 points (projects: 15, quality: 5)
Foundation: 10 points (education: 6, certifications: 4)
```

### Step 2: Convert to Percentages
```typescript
const technicalPct = (technical.score / technical.maxPoints) * 100;
// If candidate scored 30/40: (30/40) * 100 = 75%
```

### Step 3: Apply Profile Weights
```typescript
const weightedScore =
  (technicalPct * 0.35) +    // 75% * 35% = 26.25
  (experiencePct * 0.25) +
  (impactPct * 0.20) +
  (portfolioPct * 0.15) +
  (foundationPct * 0.05);
```

### Step 4: Apply Company Caliber Multiplier
```typescript
const multipliers = {
  faang: 1.15,      // 15% bonus
  unicorn: 1.10,    // 10% bonus
  established: 1.05, // 5% bonus
  startup: 1.0,     // No bonus
  unknown: 1.0,     // No bonus
};

const totalScore = Math.min(100, weightedScore * multiplier);
```

## Usage Examples

### Basic Scoring
```typescript
import { scoreCandidate } from './lib/scoring-engine';
import { defaultProfile } from './lib/scoring-profiles';

const candidate = {
  frameworks: ['React', 'Vue', 'Angular'],
  languages: ['JavaScript', 'TypeScript'],
  tools: ['Git', 'Docker'],
  yearsOfExperience: 5,
  level: 'senior',
  achievements: ['Led team', 'Launched product'],
  metrics: ['50% faster', '2x conversion'],
  projects: ['E-commerce', 'Dashboard'],
  github: true,
  liveProjects: true,
  education: 'bachelor',
  certifications: ['AWS'],
  companyTier: 'established',
};

const result = scoreCandidate(candidate, defaultProfile);
console.log(result.totalScore); // e.g., 87.5
```

### Profile Comparison
```typescript
import { scoreCandidate } from './lib/scoring-engine';
import { defaultProfile, seniorProfile, juniorProfile } from './lib/scoring-profiles';

// Score same candidate with different profiles
const defaultScore = scoreCandidate(candidate, defaultProfile);
const seniorScore = scoreCandidate(candidate, seniorProfile);
const juniorScore = scoreCandidate(candidate, juniorProfile);

console.log('Default:', defaultScore.totalScore);
console.log('Senior:', seniorScore.totalScore);
console.log('Junior:', juniorScore.totalScore);
```

### Batch Scoring and Ranking
```typescript
import { rankCandidates } from './lib/scoring-engine';
import { seniorProfile } from './lib/scoring-profiles';

const candidates = [candidate1, candidate2, candidate3];
const ranked = rankCandidates(candidates, seniorProfile);

ranked.forEach(({ candidate, score, rank }) => {
  console.log(`${rank}. ${candidate.name}: ${score.totalScore}`);
});
```

### Detailed Breakdown
```typescript
const result = scoreCandidate(candidate);

console.log('Technical:', result.technical.score, '/', result.technical.maxPoints);
console.log('  Frameworks:', result.technical.breakdown.frameworks);
console.log('  Languages:', result.technical.breakdown.languages);
console.log('  Tools:', result.technical.breakdown.tools);
```

## Validation

Run the validation script to verify weighted calculations:
```bash
npx tsx lib/scoring-validation.ts
```

This will display:
- Raw category scores and breakdowns
- Percentage calculations
- Weight applications
- Final weighted score
- Profile comparisons
- Weight sum validation (should equal 1.0)

## API Reference

### `scoreCandidate(candidate, profile?)`
Calculates a complete score for a single candidate.

**Parameters:**
- `candidate`: Object with candidate attributes
- `profile`: ScoringProfile (optional, defaults to defaultProfile)

**Returns:** CandidateScore object with:
- `totalScore`: Final weighted score (0-100)
- `technical`: CategoryScore with score, maxPoints, breakdown
- `experience`: CategoryScore with score, maxPoints, breakdown
- `impact`: CategoryScore with score, maxPoints, breakdown
- `portfolio`: CategoryScore with score, maxPoints, breakdown
- `foundation`: CategoryScore with score, maxPoints, breakdown
- `profile`: The profile used for scoring

### `scoreCandidates(candidates, profile?)`
Batch scores multiple candidates.

**Parameters:**
- `candidates`: Array of candidate objects
- `profile`: ScoringProfile (optional)

**Returns:** Array of CandidateScore objects

### `rankCandidates(candidates, profile?)`
Scores and ranks candidates by total score.

**Parameters:**
- `candidates`: Array of candidate objects
- `profile`: ScoringProfile (optional)

**Returns:** Array of objects with:
- `candidate`: Original candidate object
- `score`: CandidateScore object
- `rank`: Position in ranking (1-based)

## Files

- `/lib/scoring-engine.ts` - Core scoring logic and weighted calculations
- `/lib/scoring-profiles.ts` - Profile definitions (weights for different roles)
- `/lib/scoring-validation.ts` - Validation script to verify calculations
- `/__tests__/lib/scoring-engine.test.ts` - Comprehensive test suite

## Implementation Details

### Fixed Issues

1. **Weighted Scoring**: Changed from simple addition to proper weighted calculation
   ```typescript
   // Before (wrong):
   const totalScore = technical.score + experience.score + impact.score + ...;

   // After (correct):
   const totalScore =
     (technicalPct * profile.weights.technical) +
     (experiencePct * profile.weights.experience) + ...;
   ```

2. **Function Naming**: Fixed typo `scoreCompanyCalibur` → `scoreCompanyCaliber`

3. **Experience Points**: Verified max points = 25 (years: 15, level: 10)

### Key Principles

- All category weights must sum to 1.0 (100%)
- Category scores are converted to percentages before weighting
- Final score is always capped at 100
- Detailed breakdowns are preserved for transparency
- Company caliber is applied as a final multiplier

## Testing

Run tests with:
```bash
npm test -- scoring-engine.test.ts
```

Test coverage includes:
- Weighted score calculations
- Profile weight application
- Category max points validation
- Company caliber multipliers
- Score capping at 100
- Detailed breakdowns for all categories
- Batch scoring and ranking
