# API Routes Documentation

## Overview

This directory contains server-side API routes for resume parsing and scoring functionality.

## Routes

### POST `/api/parse`

Parses a single resume file (PDF or DOCX) and extracts structured data.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: File (PDF or DOCX)

**Response:**
```json
{
  "success": true,
  "data": {
    "personalInfo": { ... },
    "summary": "...",
    "workExperience": [ ... ],
    "education": [ ... ],
    "skills": { ... },
    "portfolio": [ ... ],
    "certifications": [ ... ],
    "languages": [ ... ],
    "metadata": { ... }
  }
}
```

**Error Responses:**
- `400`: No file provided or invalid file type
- `501`: Resume parser not yet implemented
- `500`: Parsing error

**Example:**
```bash
curl -X POST -F "file=@resume.pdf" http://localhost:3000/api/parse
```

---

### POST `/api/score`

Scores one or more resumes against a scoring profile.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `files`: File[] (one or more PDF/DOCX files)
  - `profileId`: string (optional, defaults to "default")
    - Options: `default`, `senior`, `junior`

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "fileName": "resume.pdf",
      "candidateName": "John Doe",
      "totalScore": 78.5,
      "categoryScores": {
        "technical": {
          "score": 35,
          "maxPoints": 40,
          "breakdown": { ... }
        },
        "experience": { ... },
        "impact": { ... },
        "portfolio": { ... },
        "foundation": { ... }
      },
      "profile": "Default",
      "timestamp": "2025-10-21T07:25:00.000Z",
      "success": true
    }
  ]
}
```

**Error Responses:**
- `400`: No files provided or invalid file type
- `501`: Resume parser not yet implemented
- `500`: Scoring error

**Example:**
```bash
# Score single resume
curl -X POST \
  -F "files=@resume.pdf" \
  -F "profileId=default" \
  http://localhost:3000/api/score

# Score multiple resumes with senior profile
curl -X POST \
  -F "files=@resume1.pdf" \
  -F "files=@resume2.pdf" \
  -F "profileId=senior" \
  http://localhost:3000/api/score
```

---

## Scoring Profiles

### Default Profile (Balanced)
- Technical: 35%
- Experience: 25%
- Impact: 20%
- Portfolio: 15%
- Foundation: 5%

### Senior Profile (Leadership Focus)
- Technical: 25%
- Experience: 30%
- Impact: 30%
- Portfolio: 10%
- Foundation: 5%

### Junior Profile (Technical Focus)
- Technical: 40%
- Experience: 10%
- Impact: 15%
- Portfolio: 20%
- Foundation: 15%

---

## Implementation Details

### Dependencies

Both routes require `lib/resume-parser.ts` to be implemented. If this module is not available, the routes will return a `501 Not Implemented` error.

### Data Adaptation

The `/api/score` route includes an `adaptResumeForScoring()` function that transforms the structured `ParsedResume` data into the format expected by the scoring engine. This includes:

- Calculating years of experience from work history
- Inferring seniority level from job titles
- Categorizing skills into frameworks, languages, and tools
- Extracting quantifiable metrics from achievements
- Detecting company tier (FAANG, unicorn, established, startup)
- Mapping education to standardized levels

### Error Handling

Both routes include comprehensive error handling:
- File type validation
- Graceful degradation when resume-parser is unavailable
- Per-file error handling in batch scoring
- Detailed error messages with stack traces in development

### Type Safety

All routes use TypeScript with strict types from:
- `@/types/resume` - Resume data structures
- `@/types/scoring` - Scoring profiles and results
- `@/lib/scoring-engine` - Scoring functions
- `@/lib/scoring-profiles` - Profile definitions

---

## Testing

Start the development server:
```bash
npm run dev
```

Test with sample resume:
```bash
# Parse
curl -X POST -F "file=@sample-resume.pdf" http://localhost:3000/api/parse

# Score
curl -X POST -F "files=@sample-resume.pdf" http://localhost:3000/api/score
```

Expected behavior when `resume-parser.ts` is not available:
```json
{
  "error": "Resume parser not yet implemented. Please ensure lib/resume-parser.ts exists.",
  "status": 501
}
```
