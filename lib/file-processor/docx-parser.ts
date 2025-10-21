import mammoth from 'mammoth';

/**
 * Extracts raw text content from a DOCX file
 * @param file - The DOCX file to parse
 * @returns Promise resolving to the extracted text content
 * @throws Error if parsing fails
 */
export async function parseDocx(file: File): Promise<string> {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Extract raw text from the DOCX file
    const result = await mammoth.extractRawText({ arrayBuffer });

    // Return the extracted text content
    return result.value;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to parse DOCX file: ${errorMessage}`);
  }
}
