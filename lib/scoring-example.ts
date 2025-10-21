/**
 * Example usage of the resume scoring system
 * This demonstrates how to use the parser and scoring engine
 */

import { parseResume } from './resume-parser';
import { scoreResume } from './scoring-engine';
import { getDefaultScoringProfile } from './scoring-profiles';

/**
 * Example: Score a resume file
 */
export async function scoreResumeFile(file: File) {
  try {
    // Step 1: Parse the resume
    console.log('Parsing resume...');
    const parsedResume = await parseResume(file);
    console.log('Resume parsed:', {
      name: parsedResume.name,
      email: parsedResume.email,
      yearsExperience: parsedResume.totalYearsExperience,
      skillsFound: parsedResume.skills.length,
    });

    // Step 2: Get scoring profile
    const profile = getDefaultScoringProfile();
    console.log('Using profile:', profile.name);

    // Step 3: Score the resume
    console.log('Scoring resume...');
    const scoreResult = scoreResume(parsedResume, profile);

    // Step 4: Display results
    console.log('\n=== SCORING RESULTS ===');
    console.log(`Candidate: ${scoreResult.extractedData.name}`);
    console.log(`Total Score: ${scoreResult.totalScore}/100`);
    console.log(`Verdict: ${scoreResult.verdictEmoji} ${scoreResult.verdictLabel}`);
    console.log(`Action: ${scoreResult.verdictAction}`);

    console.log('\n=== BREAKDOWN ===');
    console.log(`Technical: ${scoreResult.breakdown.technical.score}/${scoreResult.breakdown.technical.maxScore}`);
    console.log(`Experience: ${scoreResult.breakdown.experience.score}/${scoreResult.breakdown.experience.maxScore}`);
    console.log(`Impact: ${scoreResult.breakdown.impact.score}/${scoreResult.breakdown.impact.maxScore}`);
    console.log(`Portfolio: ${scoreResult.breakdown.portfolio.score}/${scoreResult.breakdown.portfolio.maxScore}`);
    console.log(`Foundation: ${scoreResult.breakdown.foundation.score}/${scoreResult.breakdown.foundation.maxScore}`);

    console.log('\n=== STRENGTHS ===');
    scoreResult.strengths.forEach((strength, i) => {
      console.log(`${i + 1}. ${strength}`);
    });

    console.log('\n=== CONCERNS ===');
    scoreResult.concerns.forEach((concern, i) => {
      console.log(`${i + 1}. ${concern}`);
    });

    return scoreResult;
  } catch (error) {
    console.error('Error scoring resume:', error);
    throw error;
  }
}

/**
 * Example: Test with mock resume data
 * Useful for testing without actual files
 */
export function testWithMockResume() {
  const mockParsedResume = {
    rawText: `
      John Doe
      john.doe@example.com
      (555) 123-4567
      San Francisco, CA

      EXPERIENCE

      Senior Front-End Developer
      Google - 2020 - Present
      - Built React component library used by 50+ teams
      - Improved page load time by 45% through optimization
      - Mentored 3 junior developers
      - Led migration to TypeScript and modern testing practices

      Front-End Developer
      Stripe - 2018 - 2020
      - Developed customer dashboard with React and TypeScript
      - Implemented CI/CD pipeline with GitHub Actions
      - Reduced bundle size by 30% using Webpack optimizations

      SKILLS
      JavaScript, TypeScript, React, Next.js, Vue, Node.js, Express
      HTML5, CSS3, Tailwind CSS, Styled Components
      Jest, Cypress, React Testing Library
      Git, GitHub, Docker, AWS, Webpack, Vite
      Accessibility, Performance Optimization, Responsive Design

      EDUCATION
      Bachelor of Science in Computer Science
      Stanford University - 2018

      PORTFOLIO
      GitHub: github.com/johndoe
      Portfolio: johndoe.dev
      LinkedIn: linkedin.com/in/johndoe
    `,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    experience: [
      {
        company: 'Google',
        role: 'Senior Front-End Developer',
        duration: '2020 - Present',
        startDate: '2020',
        endDate: 'Present',
      },
      {
        company: 'Stripe',
        role: 'Front-End Developer',
        duration: '2018 - 2020',
        startDate: '2018',
        endDate: '2020',
      },
    ],
    education: [
      {
        institution: 'Stanford University',
        degree: 'Bachelor of Science in Computer Science',
        graduationDate: '2018',
      },
    ],
    skills: [
      'javascript', 'typescript', 'react', 'next.js', 'vue', 'node.js',
      'html', 'css', 'tailwind', 'jest', 'cypress', 'git', 'docker', 'aws',
    ],
    keywords: {
      technical: ['react', 'typescript', 'javascript', 'vue', 'node.js'],
      tools: ['git', 'github', 'docker', 'aws', 'webpack', 'vite'],
      frameworks: ['react', 'next.js', 'vue', 'express'],
      soft: ['mentored', 'led', 'team'],
      testing: ['jest', 'cypress', 'react testing library'],
      styling: ['css', 'tailwind', 'styled-components'],
    },
    links: {
      github: 'github.com/johndoe',
      portfolio: 'johndoe.dev',
      linkedin: 'linkedin.com/in/johndoe',
      other: [],
    },
    metrics: [
      { text: '50+ teams', value: 50, unit: 'count', context: 'component library used by 50+ teams' },
      { text: '45%', value: 45, unit: '%', context: 'Improved page load time by 45%' },
      { text: '30%', value: 30, unit: '%', context: 'Reduced bundle size by 30%' },
    ],
    fileName: 'john-doe-resume.pdf',
    fileSize: 50000,
    parsedAt: new Date(),
    totalYearsExperience: 7,
  };

  const profile = getDefaultScoringProfile();
  const result = scoreResume(mockParsedResume, profile);

  console.log('\n=== MOCK RESUME TEST ===');
  console.log('Expected: Exceptional/Strong candidate (85+ or 70+)');
  console.log('Actual:', result.verdictEmoji, result.verdictLabel);
  console.log('Score:', result.totalScore, '/100');
  console.log('\nBreakdown:');
  console.log('- Technical:', result.breakdown.technical.score, '/', result.breakdown.technical.maxScore);
  console.log('- Experience:', result.breakdown.experience.score, '/', result.breakdown.experience.maxScore);
  console.log('- Impact:', result.breakdown.impact.score, '/', result.breakdown.impact.maxScore);
  console.log('- Portfolio:', result.breakdown.portfolio.score, '/', result.breakdown.portfolio.maxScore);
  console.log('- Foundation:', result.breakdown.foundation.score, '/', result.breakdown.foundation.maxScore);

  return result;
}

/**
 * Example: Batch score multiple resumes
 */
export async function batchScoreResumes(files: File[]) {
  const results = [];

  for (const file of files) {
    try {
      const result = await scoreResumeFile(file);
      results.push(result);
    } catch (error) {
      console.error(`Failed to score ${file.name}:`, error);
    }
  }

  // Sort by score
  results.sort((a, b) => b.totalScore - a.totalScore);

  console.log('\n=== BATCH RESULTS ===');
  results.forEach((result, i) => {
    console.log(
      `${i + 1}. ${result.extractedData.name} - ${result.totalScore}/100 - ${result.verdictEmoji} ${result.verdictLabel}`
    );
  });

  return results;
}
