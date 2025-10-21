/**
 * Resume parsing and data extraction
 * Handles PDF and DOCX file parsing, extracting structured information
 */

import { ParsedResume, ExperienceEntry, EducationEntry, MetricMatch, ExtractedLinks, ExtractedKeywords } from '@/types/resume';

// Note: These packages need to be installed:
// npm install pdf-parse mammoth

/**
 * Parse a resume file (PDF or DOCX) and extract structured data
 * @param file - The resume file to parse
 * @returns ParsedResume with all extracted data
 */
export async function parseResume(file: File): Promise<ParsedResume> {
  try {
    // Extract raw text based on file type
    const rawText = await extractText(file);

    // Extract basic information
    const name = extractName(rawText);
    const email = extractEmail(rawText);
    const phone = extractPhone(rawText);
    const location = extractLocation(rawText);

    // Extract structured data
    const experience = extractExperience(rawText);
    const education = extractEducation(rawText);
    const links = extractLinks(rawText);
    const metrics = extractMetrics(rawText);
    const keywords = extractKeywords(rawText);
    const skills = extractSkills(rawText);

    // Calculate total years of experience
    const totalYearsExperience = calculateTotalYears(experience);

    return {
      rawText,
      name,
      email,
      phone,
      location,
      experience,
      education,
      skills,
      keywords,
      links,
      metrics,
      fileName: file.name,
      fileSize: file.size,
      parsedAt: new Date(),
      totalYearsExperience,
    };
  } catch (error) {
    throw new Error(`Failed to parse resume: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract text from PDF or DOCX file
 */
async function extractText(file: File): Promise<string> {
  const fileExtension = file.name.toLowerCase().split('.').pop();

  if (fileExtension === 'pdf') {
    return extractTextFromPDF(file);
  } else if (fileExtension === 'docx' || fileExtension === 'doc') {
    return extractTextFromDOCX(file);
  } else {
    throw new Error(`Unsupported file type: ${fileExtension}`);
  }
}

/**
 * Extract text from PDF file using pdf-parse
 */
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import to avoid bundling issues
    const pdfParse = (await import('pdf-parse')) as any;
    const data = await pdfParse(buffer);

    return data.text;
  } catch (error) {
    throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract text from DOCX file using mammoth
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import to avoid bundling issues
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });

    return result.value;
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract name from resume text
 * Assumes name is in the first few lines
 */
function extractName(text: string): string {
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  // Try first non-empty line
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Name is typically 2-4 words and doesn't contain special chars
    if (firstLine.split(/\s+/).length <= 4 && /^[a-zA-Z\s.'-]+$/.test(firstLine)) {
      return firstLine;
    }
  }

  // Fallback: look for "Name:" pattern
  const nameMatch = text.match(/(?:name|candidate):\s*([a-zA-Z\s.'-]+)/i);
  if (nameMatch) {
    return nameMatch[1].trim();
  }

  return 'Unknown';
}

/**
 * Extract email address
 */
function extractEmail(text: string): string {
  const emailPattern = /[\w.-]+@[\w.-]+\.\w+/g;
  const matches = text.match(emailPattern);
  return matches ? matches[0] : '';
}

/**
 * Extract phone number
 */
function extractPhone(text: string): string | undefined {
  const phonePattern = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const matches = text.match(phonePattern);
  return matches ? matches[0] : undefined;
}

/**
 * Extract location
 */
function extractLocation(text: string): string | undefined {
  // Look for city, state patterns
  const locationPattern = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})/;
  const match = text.match(locationPattern);
  return match ? match[0] : undefined;
}

/**
 * Extract experience entries
 */
function extractExperience(text: string): ExperienceEntry[] {
  const experiences: ExperienceEntry[] = [];
  const lines = text.split('\n');

  // Common company indicators
  const companyIndicators = /(?:inc\.|llc|corp|corporation|company|ltd|limited)/i;
  const datePattern = /(?:20\d{2}|19\d{2})(?:\s*[-–—]\s*(?:20\d{2}|19\d{2}|present|current))?/i;
  const roleKeywords = /(?:developer|engineer|designer|architect|lead|senior|junior|manager|director|analyst)/i;

  let currentExperience: Partial<ExperienceEntry> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if line contains a date range (likely a job entry)
    const dateMatch = line.match(datePattern);
    if (dateMatch) {
      // Save previous experience if exists
      if (currentExperience && currentExperience.company) {
        experiences.push(currentExperience as ExperienceEntry);
      }

      // Start new experience entry
      currentExperience = {
        company: '',
        role: '',
        duration: dateMatch[0],
      };

      // Try to extract company and role from surrounding lines
      const prevLine = i > 0 ? lines[i - 1].trim() : '';
      const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';

      // Role is typically before the date, company after (or vice versa)
      if (roleKeywords.test(prevLine)) {
        currentExperience.role = prevLine;
        if (companyIndicators.test(line) || companyIndicators.test(nextLine)) {
          currentExperience.company = line.replace(dateMatch[0], '').trim() || nextLine;
        }
      } else if (roleKeywords.test(line)) {
        currentExperience.role = line.replace(dateMatch[0], '').trim();
        currentExperience.company = prevLine || nextLine;
      }
    }
  }

  // Add last experience
  if (currentExperience && currentExperience.company) {
    experiences.push(currentExperience as ExperienceEntry);
  }

  // If no structured experiences found, create at least one generic entry
  if (experiences.length === 0) {
    const yearsMatch = text.match(/(\d+)\+?\s*years?\s*(?:of\s*)?experience/i);
    if (yearsMatch) {
      experiences.push({
        company: 'Various',
        role: 'Developer',
        duration: `${yearsMatch[1]} years`,
      });
    }
  }

  return experiences;
}

/**
 * Extract education entries
 */
function extractEducation(text: string): EducationEntry[] {
  const education: EducationEntry[] = [];
  const lines = text.split('\n');

  const degreePattern = /(?:bachelor|master|phd|doctorate|bs|ms|ba|ma|b\.s\.|m\.s\.|associate)/i;
  const institutionKeywords = /(?:university|college|institute|school|academy)/i;
  const fieldPattern = /(?:computer science|software engineering|engineering|information technology|cs)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (degreePattern.test(line) || institutionKeywords.test(line)) {
      const entry: EducationEntry = {
        institution: '',
        degree: '',
      };

      // Extract degree
      const degreeMatch = line.match(degreePattern);
      if (degreeMatch) {
        entry.degree = line;
      }

      // Extract institution
      if (institutionKeywords.test(line)) {
        entry.institution = line;
      } else {
        // Check next line
        const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
        if (institutionKeywords.test(nextLine)) {
          entry.institution = nextLine;
        }
      }

      // Extract field
      const fieldMatch = line.match(fieldPattern);
      if (fieldMatch) {
        entry.field = fieldMatch[0];
      }

      if (entry.degree || entry.institution) {
        education.push(entry);
      }
    }
  }

  // Check for bootcamp or self-taught
  if (text.toLowerCase().includes('bootcamp')) {
    education.push({
      institution: 'Coding Bootcamp',
      degree: 'Certificate',
    });
  }

  if (text.toLowerCase().includes('self-taught') || text.toLowerCase().includes('self taught')) {
    education.push({
      institution: 'Self-Taught',
      degree: 'Autodidact',
    });
  }

  return education;
}

/**
 * Extract URLs and categorize them
 */
function extractLinks(text: string): ExtractedLinks {
  const links: ExtractedLinks = {
    other: [],
  };

  // Extract all URLs
  const urlPattern = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*/gi;
  const urls = text.match(urlPattern) || [];

  // Also look for domain patterns without http
  const domainPattern = /(?:^|[\s(])((?:github|linkedin|[\w-]+)\.(?:com|io|dev|net|org)\/[\w/-]+)/gi;
  const domains = text.match(domainPattern) || [];

  const allLinks = [...urls, ...domains.map(d => d.trim())];

  for (const url of allLinks) {
    const urlLower = url.toLowerCase();

    if (urlLower.includes('github.com')) {
      links.github = url;
    } else if (urlLower.includes('linkedin.com')) {
      links.linkedin = url;
    } else if (
      !urlLower.includes('linkedin') &&
      !urlLower.includes('github') &&
      (urlLower.includes('.com') || urlLower.includes('.io') || urlLower.includes('.dev'))
    ) {
      // Likely a portfolio site
      if (!links.portfolio) {
        links.portfolio = url;
      } else {
        links.other.push(url);
      }
    } else {
      links.other.push(url);
    }
  }

  return links;
}

/**
 * Extract metrics with context
 */
function extractMetrics(text: string): MetricMatch[] {
  const metrics: MetricMatch[] = [];
  const lines = text.split('\n');

  const patterns = [
    { regex: /(\d+)%/g, unit: '%' },
    { regex: /(\d+)x/gi, unit: 'x' },
    { regex: /\$(\d+(?:,\d{3})*(?:\.\d{2})?)[km]?/gi, unit: '$' },
    { regex: /(\d+(?:,\d{3})*)[km]?\s*(?:users?|customers?|visitors?|downloads?)/gi, unit: 'count' },
  ];

  lines.forEach((line, lineIndex) => {
    for (const { regex, unit } of patterns) {
      let match;
      const regexCopy = new RegExp(regex.source, regex.flags);
      while ((match = regexCopy.exec(line)) !== null) {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(value)) {
          metrics.push({
            text: match[0],
            value,
            unit,
            context: line.trim(),
            lineNumber: lineIndex + 1,
          });
        }
      }
    }
  });

  return metrics;
}

/**
 * Extract keywords by category
 */
function extractKeywords(text: string): ExtractedKeywords {
  const textLower = text.toLowerCase();

  const technicalKeywords = [
    'react', 'vue', 'angular', 'svelte', 'typescript', 'javascript', 'python', 'java', 'go', 'rust',
    'node.js', 'express', 'fastify', 'next.js', 'nuxt', 'gatsby', 'remix',
  ];

  const toolKeywords = [
    'git', 'github', 'gitlab', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'webpack', 'vite', 'rollup', 'turbopack', 'npm', 'yarn', 'pnpm',
  ];

  const frameworkKeywords = [
    'react', 'vue', 'angular', 'next.js', 'express', 'nest.js', 'fastify',
    'django', 'flask', 'spring', 'laravel',
  ];

  const testingKeywords = [
    'jest', 'vitest', 'mocha', 'chai', 'cypress', 'playwright', 'selenium',
    'react testing library', 'testing library', 'e2e', 'unit test', 'integration test',
  ];

  const stylingKeywords = [
    'css', 'sass', 'scss', 'less', 'tailwind', 'bootstrap', 'material-ui', 'mui',
    'styled-components', 'emotion', 'css-in-js', 'css modules',
  ];

  const softKeywords = [
    'leadership', 'mentoring', 'collaboration', 'communication', 'agile', 'scrum',
    'team player', 'problem solving', 'critical thinking',
  ];

  return {
    technical: technicalKeywords.filter(kw => textLower.includes(kw)),
    tools: toolKeywords.filter(kw => textLower.includes(kw)),
    frameworks: frameworkKeywords.filter(kw => textLower.includes(kw)),
    soft: softKeywords.filter(kw => textLower.includes(kw)),
    testing: testingKeywords.filter(kw => textLower.includes(kw)),
    styling: stylingKeywords.filter(kw => textLower.includes(kw)),
  };
}

/**
 * Extract all skills mentioned
 */
function extractSkills(text: string): string[] {
  const skills: Set<string> = new Set();
  const textLower = text.toLowerCase();

  // Common skill categories
  const allSkills = [
    // Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby',
    // Frontend
    'react', 'vue', 'angular', 'svelte', 'html', 'css', 'sass', 'tailwind',
    // Backend
    'node.js', 'express', 'nest.js', 'django', 'flask', 'spring boot', 'laravel',
    // Database
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'dynamodb',
    // DevOps
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins',
    // Tools
    'git', 'webpack', 'vite', 'jest', 'cypress',
  ];

  allSkills.forEach(skill => {
    if (textLower.includes(skill)) {
      skills.add(skill);
    }
  });

  return Array.from(skills);
}

/**
 * Calculate total years of experience from experience entries
 */
function calculateTotalYears(experiences: ExperienceEntry[]): number {
  let totalMonths = 0;

  for (const exp of experiences) {
    const duration = exp.duration || '';

    // Try to extract years from duration string
    const yearsMatch = duration.match(/(\d+)\s*years?/i);
    const monthsMatch = duration.match(/(\d+)\s*months?/i);

    if (yearsMatch) {
      totalMonths += parseInt(yearsMatch[1]) * 12;
    }
    if (monthsMatch) {
      totalMonths += parseInt(monthsMatch[1]);
    }

    // Try to parse date ranges (2019-2021, 2019-present, etc.)
    const dateRangeMatch = duration.match(/(\d{4})\s*[-–—]\s*(\d{4}|present|current)/i);
    if (dateRangeMatch) {
      const startYear = parseInt(dateRangeMatch[1]);
      const endYear = dateRangeMatch[2].match(/\d{4}/)
        ? parseInt(dateRangeMatch[2])
        : new Date().getFullYear();
      totalMonths += (endYear - startYear) * 12;
    }
  }

  // Convert months to years (rounded to 1 decimal)
  return Math.round((totalMonths / 12) * 10) / 10;
}
