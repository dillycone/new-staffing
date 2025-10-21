/**
 * Supported file types for processing
 */
export type FileType = 'pdf' | 'docx' | 'txt' | 'md';

/**
 * Represents a processed file with extracted content
 */
export interface ProcessedFile {
  /** Original file name */
  name: string;

  /** File type/extension */
  type: FileType;

  /** File size in bytes */
  size: number;

  /** Extracted text content from the file */
  content: string;

  /** Timestamp when the file was uploaded/processed */
  uploadedAt: Date;
}

/**
 * Error information for failed file processing
 */
export interface ProcessingError {
  /** Name of the file that failed to process */
  fileName: string;

  /** Error message describing what went wrong */
  error: string;
}
