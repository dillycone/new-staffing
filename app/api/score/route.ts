import { NextRequest, NextResponse } from 'next/server';
import { scoreCandidate } from '@/lib/scoring-engine';
import { defaultProfile, seniorProfile, juniorProfile } from '@/lib/scoring-profiles';
import type { ScoringProfile } from '@/lib/scoring-profiles';
import type { ParsedResume } from '@/types/resume';

// Import parseResume from resume-parser (will be created by Wave 1 Agent)
let parseResume: ((file: File) => Promise<ParsedResume>) | undefined;

try {
  const parser = require('@/lib/resume-parser');
  parseResume = parser.parseResume;
} catch (error) {
  console.warn('resume-parser.ts not yet available');
}

const profileMap: Record<string, ScoringProfile> = {
  default: defaultProfile,
  senior: seniorProfile,
  junior: juniorProfile,
};

/**
 * Adapts ParsedResume to the format expected by scoring-engine
 */
function adaptResumeForScoring(parsedResume: ParsedResume) {
  // Calculate years of experience from work history
  const yearsOfExperience = parsedResume.workExperience.reduce((total, exp) => {
    const startYear = new Date(exp.startDate).getFullYear();
    const endYear = exp.current || !exp.endDate
      ? new Date().getFullYear()
      : new Date(exp.endDate).getFullYear();
    return total + (endYear - startYear);
  }, 0);

  // Determine level from job titles
  const latestTitle = parsedResume.workExperience[0]?.title?.toLowerCase() || '';
  let level = 'junior';
  if (latestTitle.includes('principal') || latestTitle.includes('staff')) {
    level = 'principal';
  } else if (latestTitle.includes('lead') || latestTitle.includes('manager')) {
    level = 'lead';
  } else if (latestTitle.includes('senior') || latestTitle.includes('sr.')) {
    level = 'senior';
  } else if (latestTitle.includes('mid-level') || yearsOfExperience >= 3) {
    level = 'mid';
  }

  // Extract achievements from work experience
  const achievements = parsedResume.workExperience.flatMap(exp => exp.achievements || []);

  // Extract metrics (achievements with numbers)
  const metrics = achievements.filter(achievement =>
    /\d+%|\d+x|\$\d+|[\d,]+\s*(users|customers|requests|revenue)/.test(achievement)
  );

  // Determine education level
  let educationLevel = 'none';
  if (parsedResume.education.length > 0) {
    const degree = parsedResume.education[0].degree.toLowerCase();
    if (degree.includes('phd') || degree.includes('doctorate')) {
      educationLevel = 'phd';
    } else if (degree.includes('master') || degree.includes('mba')) {
      educationLevel = 'master';
    } else if (degree.includes('bachelor') || degree.includes('bs') || degree.includes('ba')) {
      educationLevel = 'bachelor';
    } else if (degree.includes('associate')) {
      educationLevel = 'associate';
    } else if (degree.includes('bootcamp') || degree.includes('certificate')) {
      educationLevel = 'bootcamp';
    }
  }

  // Company tier detection (simplified)
  const latestCompany = parsedResume.workExperience[0]?.company || '';
  const faangCompanies = ['google', 'apple', 'amazon', 'meta', 'facebook', 'microsoft', 'netflix'];
  const unicornCompanies = ['uber', 'airbnb', 'stripe', 'coinbase', 'databricks', 'openai'];

  let companyTier = 'startup';
  if (faangCompanies.some(name => latestCompany.toLowerCase().includes(name))) {
    companyTier = 'faang';
  } else if (unicornCompanies.some(name => latestCompany.toLowerCase().includes(name))) {
    companyTier = 'unicorn';
  } else if (yearsOfExperience > 5) {
    companyTier = 'established';
  }

  return {
    // Technical skills
    frameworks: parsedResume.skills.technical.filter(skill =>
      /react|vue|angular|svelte|next|express|django|flask|rails|spring/i.test(skill)
    ),
    languages: parsedResume.skills.technical.filter(skill =>
      /javascript|typescript|python|java|go|rust|c\+\+|c#|ruby|php|swift|kotlin/i.test(skill)
    ),
    tools: parsedResume.skills.technical.filter(skill =>
      /git|docker|kubernetes|aws|azure|gcp|jenkins|terraform|webpack|vite/i.test(skill)
    ),

    // Experience
    yearsOfExperience,
    level,
    company: latestCompany,
    companyTier,

    // Impact
    achievements,
    metrics,

    // Portfolio
    projects: parsedResume.portfolio,
    github: parsedResume.personalInfo.github,
    liveProjects: parsedResume.portfolio.some(p => p.url),

    // Foundation
    education: educationLevel,
    certifications: parsedResume.certifications,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const profileId = (formData.get('profileId') as string) || 'default';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Validate file types
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type for ${file.name}. Only PDF and DOCX files are supported.` },
          { status: 400 }
        );
      }
    }

    // Check if parseResume is available
    if (!parseResume) {
      return NextResponse.json(
        { error: 'Resume parser not yet implemented. Please ensure lib/resume-parser.ts exists.' },
        { status: 501 }
      );
    }

    const profile = profileMap[profileId] || defaultProfile;

    // Parse and score each resume
    const results = [];
    for (const file of files) {
      try {
        const parsedResume = await parseResume(file);
        const adaptedData = adaptResumeForScoring(parsedResume);
        const scoreResult = scoreCandidate(adaptedData, profile);

        results.push({
          fileName: file.name,
          candidateName: parsedResume.personalInfo.name,
          totalScore: scoreResult.totalScore,
          categoryScores: {
            technical: scoreResult.technical,
            experience: scoreResult.experience,
            impact: scoreResult.impact,
            portfolio: scoreResult.portfolio,
            foundation: scoreResult.foundation,
          },
          profile: scoreResult.profile.name,
          timestamp: new Date().toISOString(),
          success: true,
        });
      } catch (error) {
        console.error(`Error scoring ${file.name}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          fileName: file.name,
          error: errorMessage,
          totalScore: 0,
          success: false,
        });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Scoring error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to score resumes', details: errorMessage },
      { status: 500 }
    );
  }
}
