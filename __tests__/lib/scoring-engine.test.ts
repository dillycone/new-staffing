import { scoreCandidate, scoreCandidates, rankCandidates } from '../../lib/scoring-engine';
import { defaultProfile, seniorProfile, juniorProfile } from '../../lib/scoring-profiles';

describe('Scoring Engine', () => {
  const mockCandidate = {
    frameworks: ['React', 'Next.js', 'Vue'],
    languages: ['JavaScript', 'TypeScript', 'Python'],
    tools: ['Git', 'Docker'],
    yearsOfExperience: 5,
    level: 'senior',
    achievements: ['Led migration', 'Improved performance'],
    metrics: ['50% faster load times'],
    projects: ['E-commerce platform', 'Analytics dashboard'],
    github: true,
    liveProjects: true,
    education: 'bachelor',
    certifications: ['AWS Certified'],
    companyTier: 'established',
  };

  describe('scoreCandidate', () => {
    it('should calculate weighted score correctly with default profile', () => {
      const result = scoreCandidate(mockCandidate);

      // Verify category scores are calculated
      expect(result.technical.score).toBeGreaterThan(0);
      expect(result.experience.score).toBeGreaterThan(0);
      expect(result.impact.score).toBeGreaterThan(0);
      expect(result.portfolio.score).toBeGreaterThan(0);
      expect(result.foundation.score).toBeGreaterThan(0);

      // Verify total score is between 0 and 100
      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);

      // Verify profile is attached
      expect(result.profile).toEqual(defaultProfile);
    });

    it('should apply category weights from profile', () => {
      const result = scoreCandidate(mockCandidate, defaultProfile);

      // Calculate expected weighted score manually
      const techPct = (result.technical.score / result.technical.maxPoints) * 100;
      const expPct = (result.experience.score / result.experience.maxPoints) * 100;
      const impactPct = (result.impact.score / result.impact.maxPoints) * 100;
      const portfolioPct = (result.portfolio.score / result.portfolio.maxPoints) * 100;
      const foundationPct = (result.foundation.score / result.foundation.maxPoints) * 100;

      const expectedWeighted =
        (techPct * 0.35) +
        (expPct * 0.25) +
        (impactPct * 0.20) +
        (portfolioPct * 0.15) +
        (foundationPct * 0.05);

      // Apply caliber multiplier (established = 1.05)
      const expectedTotal = Math.min(100, expectedWeighted * 1.05);

      expect(result.totalScore).toBeCloseTo(expectedTotal, 1);
    });

    it('should produce different scores for different profiles', () => {
      const defaultScore = scoreCandidate(mockCandidate, defaultProfile);
      const seniorScore = scoreCandidate(mockCandidate, seniorProfile);
      const juniorScore = scoreCandidate(mockCandidate, juniorProfile);

      // Since the candidate has senior-level attributes,
      // senior profile should potentially score differently than junior
      expect(defaultScore.totalScore).not.toEqual(seniorScore.totalScore);
      expect(defaultScore.totalScore).not.toEqual(juniorScore.totalScore);
    });

    it('should respect max points for each category', () => {
      const result = scoreCandidate(mockCandidate);

      expect(result.technical.score).toBeLessThanOrEqual(result.technical.maxPoints);
      expect(result.experience.score).toBeLessThanOrEqual(result.experience.maxPoints);
      expect(result.impact.score).toBeLessThanOrEqual(result.impact.maxPoints);
      expect(result.portfolio.score).toBeLessThanOrEqual(result.portfolio.maxPoints);
      expect(result.foundation.score).toBeLessThanOrEqual(result.foundation.maxPoints);
    });

    it('should have correct max points for experience category', () => {
      const result = scoreCandidate(mockCandidate);

      // Experience max should be 25 (years: 15, level: 10)
      expect(result.experience.maxPoints).toBe(25);
    });

    it('should handle company caliber multiplier', () => {
      const faangCandidate = { ...mockCandidate, companyTier: 'faang' };
      const startupCandidate = { ...mockCandidate, companyTier: 'startup' };

      const faangScore = scoreCandidate(faangCandidate);
      const startupScore = scoreCandidate(startupCandidate);

      // FAANG should have higher score due to 1.15x multiplier
      expect(faangScore.totalScore).toBeGreaterThan(startupScore.totalScore);
    });

    it('should cap total score at 100', () => {
      const perfectCandidate = {
        frameworks: Array(10).fill('Framework'),
        languages: Array(10).fill('Language'),
        tools: Array(10).fill('Tool'),
        yearsOfExperience: 20,
        level: 'principal',
        achievements: Array(10).fill('Achievement'),
        metrics: Array(10).fill('Metric'),
        projects: Array(10).fill('Project'),
        github: true,
        liveProjects: true,
        education: 'phd',
        certifications: Array(10).fill('Cert'),
        companyTier: 'faang',
      };

      const result = scoreCandidate(perfectCandidate);
      expect(result.totalScore).toBeLessThanOrEqual(100);
    });
  });

  describe('scoreCandidates', () => {
    it('should score multiple candidates', () => {
      const candidates = [mockCandidate, { ...mockCandidate, level: 'junior' }];
      const results = scoreCandidates(candidates);

      expect(results).toHaveLength(2);
      expect(results[0].totalScore).toBeDefined();
      expect(results[1].totalScore).toBeDefined();
    });
  });

  describe('rankCandidates', () => {
    it('should rank candidates by score', () => {
      const strongCandidate = mockCandidate;
      const weakCandidate = {
        ...mockCandidate,
        yearsOfExperience: 1,
        level: 'junior',
        frameworks: ['React'],
        languages: ['JavaScript'],
      };

      const ranked = rankCandidates([weakCandidate, strongCandidate]);

      expect(ranked).toHaveLength(2);
      expect(ranked[0].rank).toBe(1);
      expect(ranked[1].rank).toBe(2);
      expect(ranked[0].score.totalScore).toBeGreaterThan(ranked[1].score.totalScore);
    });
  });

  describe('Category scoring details', () => {
    it('should provide detailed breakdowns for technical category', () => {
      const result = scoreCandidate(mockCandidate);

      expect(result.technical.breakdown).toHaveProperty('frameworks');
      expect(result.technical.breakdown).toHaveProperty('languages');
      expect(result.technical.breakdown).toHaveProperty('tools');
    });

    it('should provide detailed breakdowns for experience category', () => {
      const result = scoreCandidate(mockCandidate);

      expect(result.experience.breakdown).toHaveProperty('years');
      expect(result.experience.breakdown).toHaveProperty('level');
    });

    it('should provide detailed breakdowns for impact category', () => {
      const result = scoreCandidate(mockCandidate);

      expect(result.impact.breakdown).toHaveProperty('achievements');
      expect(result.impact.breakdown).toHaveProperty('metrics');
    });

    it('should provide detailed breakdowns for portfolio category', () => {
      const result = scoreCandidate(mockCandidate);

      expect(result.portfolio.breakdown).toHaveProperty('projects');
      expect(result.portfolio.breakdown).toHaveProperty('quality');
    });

    it('should provide detailed breakdowns for foundation category', () => {
      const result = scoreCandidate(mockCandidate);

      expect(result.foundation.breakdown).toHaveProperty('education');
      expect(result.foundation.breakdown).toHaveProperty('certifications');
    });
  });
});
