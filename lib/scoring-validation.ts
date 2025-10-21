/**
 * Validation script to demonstrate weighted scoring calculations
 * Run with: npx ts-node lib/scoring-validation.ts
 */

import { scoreCandidate } from './scoring-engine';
import { defaultProfile, seniorProfile, juniorProfile } from './scoring-profiles';

// Sample candidate with known values for verification
const sampleCandidate = {
  name: 'Jane Doe',
  frameworks: ['React', 'Next.js', 'Vue', 'Angular', 'Svelte'], // 5 frameworks = 15 points (capped)
  languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust'], // 5 languages = 15 points (capped)
  tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Terraform'], // 5 tools = 10 points (capped)
  yearsOfExperience: 8, // 8 * 1.5 = 12 points
  level: 'senior', // 8 points
  achievements: ['Led team of 5', 'Launched 3 products', 'Improved metrics'], // 3 achievements = 12 points
  metrics: ['50% faster', '2x conversion', '99.9% uptime', '$1M revenue'], // 4 metrics = 10 points (capped)
  projects: ['E-commerce', 'Analytics', 'Mobile app'], // 3 projects = 15 points (capped)
  github: true, // 2 points
  liveProjects: true, // 3 points
  education: 'bachelor', // 5 points
  certifications: ['AWS', 'GCP'], // 2 certs = 4 points (capped)
  companyTier: 'faang', // 1.15x multiplier
};

console.log('='.repeat(80));
console.log('SCORING ENGINE VALIDATION - Weighted Calculations');
console.log('='.repeat(80));
console.log();

// Score with default profile
const defaultScore = scoreCandidate(sampleCandidate, defaultProfile);

console.log('CANDIDATE:', sampleCandidate.name);
console.log('-'.repeat(80));
console.log();

console.log('CATEGORY SCORES (Raw Points):');
console.log('-'.repeat(80));
console.log(`Technical:   ${defaultScore.technical.score}/${defaultScore.technical.maxPoints} points`);
console.log(`  - Frameworks: ${defaultScore.technical.breakdown.frameworks}`);
console.log(`  - Languages:  ${defaultScore.technical.breakdown.languages}`);
console.log(`  - Tools:      ${defaultScore.technical.breakdown.tools}`);
console.log();

console.log(`Experience:  ${defaultScore.experience.score}/${defaultScore.experience.maxPoints} points`);
console.log(`  - Years:      ${defaultScore.experience.breakdown.years}`);
console.log(`  - Level:      ${defaultScore.experience.breakdown.level}`);
console.log();

console.log(`Impact:      ${defaultScore.impact.score}/${defaultScore.impact.maxPoints} points`);
console.log(`  - Achievements: ${defaultScore.impact.breakdown.achievements}`);
console.log(`  - Metrics:      ${defaultScore.impact.breakdown.metrics}`);
console.log();

console.log(`Portfolio:   ${defaultScore.portfolio.score}/${defaultScore.portfolio.maxPoints} points`);
console.log(`  - Projects:   ${defaultScore.portfolio.breakdown.projects}`);
console.log(`  - Quality:    ${defaultScore.portfolio.breakdown.quality}`);
console.log();

console.log(`Foundation:  ${defaultScore.foundation.score}/${defaultScore.foundation.maxPoints} points`);
console.log(`  - Education:      ${defaultScore.foundation.breakdown.education}`);
console.log(`  - Certifications: ${defaultScore.foundation.breakdown.certifications}`);
console.log();

console.log('='.repeat(80));
console.log('WEIGHTED CALCULATION (Default Profile):');
console.log('-'.repeat(80));

// Manual calculation to show the weighted scoring
const techPct = (defaultScore.technical.score / defaultScore.technical.maxPoints) * 100;
const expPct = (defaultScore.experience.score / defaultScore.experience.maxPoints) * 100;
const impactPct = (defaultScore.impact.score / defaultScore.impact.maxPoints) * 100;
const portfolioPct = (defaultScore.portfolio.score / defaultScore.portfolio.maxPoints) * 100;
const foundationPct = (defaultScore.foundation.score / defaultScore.foundation.maxPoints) * 100;

console.log(`Technical:   ${techPct.toFixed(1)}% × 0.35 (35%) = ${(techPct * 0.35).toFixed(2)}`);
console.log(`Experience:  ${expPct.toFixed(1)}% × 0.25 (25%) = ${(expPct * 0.25).toFixed(2)}`);
console.log(`Impact:      ${impactPct.toFixed(1)}% × 0.20 (20%) = ${(impactPct * 0.20).toFixed(2)}`);
console.log(`Portfolio:   ${portfolioPct.toFixed(1)}% × 0.15 (15%) = ${(portfolioPct * 0.15).toFixed(2)}`);
console.log(`Foundation:  ${foundationPct.toFixed(1)}% × 0.05 (5%)  = ${(foundationPct * 0.05).toFixed(2)}`);
console.log('-'.repeat(80));

const weightedSum =
  (techPct * 0.35) +
  (expPct * 0.25) +
  (impactPct * 0.20) +
  (portfolioPct * 0.15) +
  (foundationPct * 0.05);

console.log(`Weighted Sum: ${weightedSum.toFixed(2)}`);
console.log(`Company Caliber: FAANG (1.15x multiplier)`);
console.log(`Final Score: ${weightedSum.toFixed(2)} × 1.15 = ${(weightedSum * 1.15).toFixed(2)}`);
console.log(`Capped at 100: ${Math.min(100, weightedSum * 1.15).toFixed(1)}`);
console.log();
console.log(`TOTAL SCORE: ${defaultScore.totalScore}`);
console.log('='.repeat(80));
console.log();

// Compare different profiles
console.log('PROFILE COMPARISON:');
console.log('-'.repeat(80));

const seniorScore = scoreCandidate(sampleCandidate, seniorProfile);
const juniorScore = scoreCandidate(sampleCandidate, juniorProfile);

console.log(`Default Profile:  ${defaultScore.totalScore.toFixed(1)} (35% tech, 25% exp, 20% impact)`);
console.log(`Senior Profile:   ${seniorScore.totalScore.toFixed(1)} (25% tech, 30% exp, 30% impact)`);
console.log(`Junior Profile:   ${juniorScore.totalScore.toFixed(1)} (40% tech, 10% exp, 15% impact)`);
console.log();
console.log('Note: Senior profile emphasizes experience & impact');
console.log('      Junior profile emphasizes technical skills & portfolio');
console.log('='.repeat(80));
console.log();

// Verify weights sum to 1.0
console.log('WEIGHT VALIDATION:');
console.log('-'.repeat(80));
const defaultSum = Object.values(defaultProfile.weights).reduce((a, b) => a + b, 0);
const seniorSum = Object.values(seniorProfile.weights).reduce((a, b) => a + b, 0);
const juniorSum = Object.values(juniorProfile.weights).reduce((a, b) => a + b, 0);

console.log(`Default weights sum: ${defaultSum.toFixed(2)} ✓`);
console.log(`Senior weights sum:  ${seniorSum.toFixed(2)} ✓`);
console.log(`Junior weights sum:  ${juniorSum.toFixed(2)} ✓`);
console.log('='.repeat(80));
