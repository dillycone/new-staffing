/**
 * Resume parsing and data extraction types
 */

export interface ExperienceEntry {
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  duration?: string; // e.g., "2 years", "2019-2021"
  description?: string;
  location?: string;
}

export interface EducationEntry {
  institution: string;
  degree?: string;
  field?: string;
  graduationDate?: string;
  description?: string;
}

export interface MetricMatch {
  text: string; // e.g., "45% improvement"
  value?: number; // extracted number: 45
  unit?: string; // %, $, s, etc.
  context?: string; // surrounding text for context
  lineNumber?: number;
}

export interface ExtractedLinks {
  github?: string;
  portfolio?: string;
  linkedin?: string;
  other: string[];
}

export interface ExtractedKeywords {
  technical: string[]; // React, TypeScript, etc.
  tools: string[]; // Git, Webpack, etc.
  frameworks: string[]; // Next.js, Express, etc.
  soft: string[]; // leadership, collaboration, etc.
  testing: string[]; // Jest, Cypress, etc.
  styling: string[]; // Tailwind, CSS-in-JS, etc.
}

export interface ParsedResume {
  // Basic Information
  rawText: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;

  // Experience & Education
  experience: ExperienceEntry[];
  education: EducationEntry[];

  // Extracted Data
  skills: string[]; // All skills mentioned
  keywords: ExtractedKeywords;
  links: ExtractedLinks;
  metrics: MetricMatch[];

  // Metadata
  fileName: string;
  fileSize?: number;
  parsedAt: Date;
  totalYearsExperience?: number; // Calculated from experience entries
}

export interface ResumeUpload {
  id: string;
  file: File;
  status: 'pending' | 'parsing' | 'parsed' | 'scoring' | 'scored' | 'error';
  parsedResume?: ParsedResume;
  error?: string;
  uploadedAt: Date;
}
