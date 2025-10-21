import { NextRequest, NextResponse } from 'next/server';
import { processFiles } from '@/lib/file-processor/processor';
import type { ProcessedFile } from '@/lib/file-processor/types';

/**
 * POST /api/upload
 * Handles file uploads and text extraction
 *
 * Accepts: multipart/form-data with files
 * Returns: Array of processed files with extracted text
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files: File[] = [];

    // Extract all files from form data
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files.push(value);
      }
    }

    // Validate that files were provided
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Process all files using the file processor
    const processedFiles: ProcessedFile[] = await processFiles(files);

    // Return success response with processed files
    return NextResponse.json({
      success: true,
      files: processedFiles,
      count: processedFiles.length,
    }, { status: 200 });

  } catch (error) {
    // Log error for debugging (in production, use proper logging)
    console.error('File upload error:', error);

    // Return error response
    const errorMessage = error instanceof Error
      ? error.message
      : 'Failed to process files';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload
 * Returns API information
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/upload',
    method: 'POST',
    accepts: 'multipart/form-data',
    supportedFormats: ['pdf', 'docx', 'txt', 'md'],
    maxFileSize: '10MB (configurable)',
  });
}
