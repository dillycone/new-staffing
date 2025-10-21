import type { FileType, ProcessedFile } from './types';

// Import parser functions
import { parsePdf } from './pdf-parser';
import { parseDocx } from './docx-parser';
import { parseText, parseMarkdown } from './text-parser';

/**
 * Extracts the file extension and validates it as a supported file type
 */
function getFileType(fileName: string): FileType {
  const extension = fileName.split('.').pop()?.toLowerCase();

  const supportedTypes: FileType[] = ['pdf', 'docx', 'txt', 'md'];

  if (!extension || !supportedTypes.includes(extension as FileType)) {
    throw new Error(
      `Unsupported file type: ${extension || 'unknown'}. Supported types: ${supportedTypes.join(', ')}`
    );
  }

  return extension as FileType;
}

/**
 * Processes a single file and extracts its text content
 *
 * @param file - The file to process
 * @returns Processed file with extracted content
 * @throws Error if file type is unsupported or parsing fails
 */
export async function processFile(file: File): Promise<ProcessedFile> {
  try {
    const fileType = getFileType(file.name);
    let content: string;

    // Call the appropriate parser based on file type
    switch (fileType) {
      case 'pdf':
        content = await parsePdf(file);
        break;

      case 'docx':
        content = await parseDocx(file);
        break;

      case 'txt':
        content = await parseText(file);
        break;

      case 'md':
        // Markdown files use dedicated parser
        content = await parseMarkdown(file);
        break;

      default:
        // TypeScript should prevent this, but include for runtime safety
        throw new Error(`Unhandled file type: ${fileType}`);
    }

    return {
      name: file.name,
      type: fileType,
      size: file.size,
      content,
      uploadedAt: new Date(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to process file "${file.name}": ${errorMessage}`);
  }
}

/**
 * Processes multiple files in batch
 *
 * @param files - Array of files to process
 * @returns Array of processed files with extracted content
 * @throws Error if any file fails to process
 */
export async function processFiles(files: File[]): Promise<ProcessedFile[]> {
  if (!files || files.length === 0) {
    return [];
  }

  try {
    // Process all files in parallel for better performance
    const processedFiles = await Promise.all(
      files.map(file => processFile(file))
    );

    return processedFiles;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Batch processing failed: ${errorMessage}`);
  }
}
