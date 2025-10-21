# new-staffing

A modern resume scoring and profile management workflow application built with Next.js, React, and TypeScript. This application provides an intuitive interface for uploading resumes, applying scoring profiles, and evaluating candidates based on customizable criteria.

## Features

- **Resume Upload & Management**: Bulk upload resumes with automatic file parsing
- **Scoring Profiles**: Apply proven scoring profiles or create custom evaluation criteria
- **3D Carousel Interface**: Interactive workflow visualization with accessibility support
- **Multi-Category Scoring**: Evaluate candidates across technical skills, experience, impact, portfolio, and foundation
- **Real-time Workflow State**: Track uploads, scoring progress, and results with React Context

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd new-staffing
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The application will automatically reload when you make changes to the source code.

## Building for Production

Build the optimized production bundle:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
new-staffing/
├── app/                    # Next.js 15 app directory
│   ├── layout.tsx         # Root layout with WorkflowProvider
│   ├── page.tsx           # Home page with 3D carousel
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components (button, card, carousel)
│   └── carousel-3d.tsx   # Main workflow carousel component
├── contexts/             # React Context providers
│   └── workflow-context.tsx  # Global workflow state management
├── types/                # TypeScript type definitions
│   ├── resume.ts        # Resume and parsing types
│   └── scoring.ts       # Scoring and evaluation types
├── lib/                  # Utility functions
└── public/              # Static assets
```

## Architecture

### Scoring System

The application uses a multi-category scoring system to evaluate candidates:

1. **Technical Skills** (frameworks, languages, tools)
2. **Experience** (years, role level, career progression)
3. **Impact** (business achievements, quantifiable results)
4. **Portfolio** (projects, quality of work, contributions)
5. **Foundation** (education, certifications, academic background)

Each category receives:
- A raw score (0-100)
- A weight defined by the scoring profile
- A weighted contribution to the overall score

The final score is a weighted composite (0-100) with an accompanying verdict:
- `strong_match`: Excellent fit, highly recommended
- `good_match`: Good fit, recommended
- `moderate_match`: Acceptable fit, consider with reservations
- `weak_match`: Poor fit, not recommended
- `insufficient_data`: Not enough information to make a determination

### Workflow State Management

The application uses React Context (`WorkflowProvider`) to manage:
- Uploaded resume files and their processing status
- Selected scoring profile
- Scoring results and progress
- Modal states for upload, profile selection, and scoring progress

### Resume Processing

Resume parsing extracts structured data including:
- Personal information (name, contact, links)
- Work experience with achievements and technologies
- Education and certifications
- Skills (technical, soft, domain-specific)
- Portfolio items and projects

## Environment Variables

Currently, this application does not require environment variables. All processing happens client-side with potential server-side API routes for resume parsing.

## Known Caveats

### Resume Parsing Limitations

**Important**: Resume parsing must happen server-side to ensure accuracy and security. The current client-side architecture includes placeholder types for resume parsing, but actual PDF/DOCX parsing requires:

1. **Server-side processing**: Implement API routes in `app/api/` to handle file uploads
2. **Parsing libraries**: Install libraries like `pdf-parse`, `mammoth`, or commercial APIs
3. **File size limits**: Configure Next.js to handle larger file uploads in `next.config.ts`
4. **Security considerations**: Validate file types, sanitize uploads, and limit file sizes

Example server-side implementation needed:

```typescript
// app/api/parse-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');

  // TODO: Implement parsing logic
  // - Extract text from PDF/DOCX
  // - Use NLP or LLM to structure data
  // - Return ParsedResume object

  return NextResponse.json({ parsedData: {...} });
}
```

### Client-Side Limitations

- File parsing currently relies on placeholder types
- Large resume batches may impact browser performance
- Consider implementing pagination for large result sets

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **Carousel**: Embla Carousel

## Development

### Code Style

The project uses:
- TypeScript strict mode
- ESLint for code quality
- Tailwind CSS for styling with custom design tokens

### Running Linter

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

Copyright (c) 2025 new-staffing

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
