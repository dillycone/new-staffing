/**
 * Resume domain types
 *
 * This module defines all types related to resume uploads and parsed resume data.
 */

/**
 * Represents an uploaded resume file
 */
export interface ResumeUpload {
  /** Unique identifier for the upload */
  id: string;
  /** Original file object */
  file: File;
  /** Display name of the file */
  name: string;
  /** File size in bytes */
  size: number;
  /** Upload timestamp */
  uploadedAt: Date;
  /** Current processing status */
  status: 'pending' | 'processing' | 'completed' | 'error';
  /** Optional error message if status is 'error' */
  error?: string;
  /** Parsed resume data (available when status is 'completed') */
  parsedData?: ParsedResume;
}

/**
 * Structured data extracted from a resume
 */
export interface ParsedResume {
  /** Candidate's personal information */
  personalInfo: PersonalInfo;
  /** Professional summary or objective */
  summary?: string;
  /** Work experience entries */
  workExperience: WorkExperience[];
  /** Educational background */
  education: Education[];
  /** Technical and soft skills */
  skills: Skills;
  /** Portfolio items, projects, or publications */
  portfolio: PortfolioItem[];
  /** Certifications and licenses */
  certifications: Certification[];
  /** Languages spoken */
  languages?: Language[];
  /** Additional metadata */
  metadata?: ResumeMetadata;
}

/**
 * Personal information section
 */
export interface PersonalInfo {
  /** Full name */
  name: string;
  /** Email address */
  email?: string;
  /** Phone number */
  phone?: string;
  /** Location (city, state, country) */
  location?: string;
  /** LinkedIn profile URL */
  linkedIn?: string;
  /** GitHub profile URL */
  github?: string;
  /** Personal website or portfolio URL */
  website?: string;
}

/**
 * Work experience entry
 */
export interface WorkExperience {
  /** Job title */
  title: string;
  /** Company name */
  company: string;
  /** Location of the job */
  location?: string;
  /** Start date */
  startDate: string;
  /** End date (null or 'Present' for current positions) */
  endDate?: string | null;
  /** Whether this is the current position */
  current?: boolean;
  /** Job description and responsibilities */
  description?: string;
  /** Key achievements and impact */
  achievements?: string[];
  /** Technologies and tools used */
  technologies?: string[];
}

/**
 * Education entry
 */
export interface Education {
  /** Degree or certification name */
  degree: string;
  /** Institution name */
  institution: string;
  /** Field of study or major */
  fieldOfStudy?: string;
  /** Location of the institution */
  location?: string;
  /** Start date */
  startDate?: string;
  /** End date or expected graduation */
  endDate?: string;
  /** GPA or academic honors */
  gpa?: string;
  /** Relevant coursework */
  coursework?: string[];
}

/**
 * Skills categorization
 */
export interface Skills {
  /** Technical skills (programming languages, frameworks, tools) */
  technical: string[];
  /** Soft skills (leadership, communication, etc.) */
  soft?: string[];
  /** Domain-specific expertise */
  domain?: string[];
}

/**
 * Portfolio item or project
 */
export interface PortfolioItem {
  /** Project or portfolio item name */
  name: string;
  /** Description of the project */
  description?: string;
  /** Technologies used */
  technologies?: string[];
  /** URL to the project or portfolio */
  url?: string;
  /** Role in the project */
  role?: string;
  /** Project date or timeframe */
  date?: string;
  /** Key achievements or impact */
  impact?: string;
}

/**
 * Certification or license
 */
export interface Certification {
  /** Certification name */
  name: string;
  /** Issuing organization */
  issuer: string;
  /** Issue date */
  issueDate?: string;
  /** Expiration date */
  expirationDate?: string;
  /** Credential ID or URL */
  credentialId?: string;
  /** Credential URL for verification */
  credentialUrl?: string;
}

/**
 * Language proficiency
 */
export interface Language {
  /** Language name */
  name: string;
  /** Proficiency level (native, fluent, professional, basic) */
  proficiency: 'native' | 'fluent' | 'professional' | 'intermediate' | 'basic';
}

/**
 * Resume parsing metadata
 */
export interface ResumeMetadata {
  /** Parsing timestamp */
  parsedAt: Date;
  /** Parser version or engine used */
  parserVersion?: string;
  /** Confidence score of the parsing (0-1) */
  confidence?: number;
  /** Number of pages in the original document */
  pageCount?: number;
  /** Original file format */
  fileFormat?: string;
}
