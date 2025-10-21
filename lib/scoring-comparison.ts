/**
 * Comparison: Old (broken) vs New (weighted) scoring
 * This demonstrates why weighted scoring is critical
 */

import { scoreCandidate } from './scoring-engine';
import { defaultProfile } from './scoring-profiles';

// Sample candidate with mixed performance
const candidate = {
  name: 'Alex Smith',
  // Strong technical skills
  frameworks: ['React', 'Vue', 'Angular', 'Svelte', 'Next.js'],
  languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust'],
  tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Terraform'],
  // Weak experience (junior level)
  yearsOfExperience: 2,
  level: 'junior',
  // Moderate impact
  achievements: ['Built feature'],
  metrics: ['Improved performance'],
  // Good portfolio
  projects: ['Personal blog', 'Todo app', 'Weather app'],
  github: true,
  liveProjects: true,
  // Good foundation
  education: 'bachelor',
  certifications: ['AWS'],
  companyTier: 'startup',
};

console.log('='.repeat(80));
console.log('SCORING COMPARISON: Old vs New Approach');
console.log('='.repeat(80));
console.log();

// New weighted scoring
const result = scoreCandidate(candidate, defaultProfile);

console.log('CANDIDATE:', candidate.name);
console.log('-'.repeat(80));
console.log('Profile: Strong technical, weak experience, moderate others');
console.log();

console.log('CATEGORY SCORES:');
console.log('-'.repeat(80));
console.log(`Technical:   ${result.technical.score}/${result.technical.maxPoints} points = ${((result.technical.score / result.technical.maxPoints) * 100).toFixed(1)}%`);
console.log(`Experience:  ${result.experience.score}/${result.experience.maxPoints} points = ${((result.experience.score / result.experience.maxPoints) * 100).toFixed(1)}%`);
console.log(`Impact:      ${result.impact.score}/${result.impact.maxPoints} points = ${((result.impact.score / result.impact.maxPoints) * 100).toFixed(1)}%`);
console.log(`Portfolio:   ${result.portfolio.score}/${result.portfolio.maxPoints} points = ${((result.portfolio.score / result.portfolio.maxPoints) * 100).toFixed(1)}%`);
console.log(`Foundation:  ${result.foundation.score}/${result.foundation.maxPoints} points = ${((result.foundation.score / result.foundation.maxPoints) * 100).toFixed(1)}%`);
console.log();

// Calculate old (broken) way - simple addition
const oldScore = Math.min(100,
  result.technical.score +
  result.experience.score +
  result.impact.score +
  result.portfolio.score +
  result.foundation.score
);

console.log('='.repeat(80));
console.log('OLD APPROACH (BROKEN): Simple Addition');
console.log('-'.repeat(80));
console.log(`Technical:   ${result.technical.score} points`);
console.log(`Experience:  ${result.experience.score} points`);
console.log(`Impact:      ${result.impact.score} points`);
console.log(`Portfolio:   ${result.portfolio.score} points`);
console.log(`Foundation:  ${result.foundation.score} points`);
console.log('-'.repeat(80));
console.log(`Total: ${oldScore} (simple sum, capped at 100)`);
console.log();
console.log('❌ PROBLEM: This ignores that categories have different max points!');
console.log('   Technical (40 max) dominates over Foundation (10 max)');
console.log('   Profile weights are completely ignored');
console.log();

console.log('='.repeat(80));
console.log('NEW APPROACH (CORRECT): Weighted Calculation');
console.log('-'.repeat(80));

const techPct = (result.technical.score / result.technical.maxPoints) * 100;
const expPct = (result.experience.score / result.experience.maxPoints) * 100;
const impactPct = (result.impact.score / result.impact.maxPoints) * 100;
const portfolioPct = (result.portfolio.score / result.portfolio.maxPoints) * 100;
const foundationPct = (result.foundation.score / result.foundation.maxPoints) * 100;

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
console.log(`Company Caliber: Startup (1.0x multiplier)`);
console.log(`Total: ${result.totalScore}`);
console.log();
console.log('✅ CORRECT: Each category contributes based on:');
console.log('   1. Performance (% of max points earned)');
console.log('   2. Importance (profile weight)');
console.log('   Categories with higher weights have more impact');
console.log();

console.log('='.repeat(80));
console.log('IMPACT OF WEIGHTS');
console.log('-'.repeat(80));
console.log();
console.log(`Old Score: ${oldScore}`);
console.log(`New Score: ${result.totalScore}`);
console.log(`Difference: ${Math.abs(oldScore - result.totalScore).toFixed(1)} points`);
console.log();
console.log('Why the difference?');
console.log('- Old: Technical (40 pts) overwhelms Experience (7 pts)');
console.log('- New: Technical excellence (100%) weighted at 35%');
console.log('       Experience weakness (28%) weighted at 25%');
console.log('       Balanced contribution from all categories');
console.log();

console.log('='.repeat(80));
console.log('CONCLUSION');
console.log('-'.repeat(80));
console.log('✅ Weighted scoring properly reflects candidate strengths');
console.log('✅ Profile weights allow role-specific evaluation');
console.log('✅ Categories contribute proportionally to their importance');
console.log('✅ Final score is meaningful and comparable across candidates');
console.log('='.repeat(80));
