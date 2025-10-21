import { NextRequest, NextResponse } from 'next/server';
import { ParsedResume } from '@/types/resume';

// Import parseResume from resume-parser (will be created by Wave 1 Agent)
// For now, we'll add a placeholder that throws if called before implementation
let parseResume: ((file: File) => Promise<ParsedResume>) | undefined;

try {
  // Dynamically import parseResume if available
  const parser = require('@/lib/resume-parser');
  parseResume = parser.parseResume;
} catch (error) {
  // resume-parser.ts not yet created - will be handled in error response
  console.warn('resume-parser.ts not yet available');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX files are supported.' },
        { status: 400 }
      );
    }

    // Check if parseResume is available
    if (!parseResume) {
      return NextResponse.json(
        { error: 'Resume parser not yet implemented. Please ensure lib/resume-parser.ts exists.' },
        { status: 501 }
      );
    }

    // Parse the resume
    const parsedResume = await parseResume(file);

    return NextResponse.json({ success: true, data: parsedResume });
  } catch (error) {
    console.error('Resume parsing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to parse resume', details: errorMessage },
      { status: 500 }
    );
  }
}
