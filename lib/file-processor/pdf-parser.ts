/**
 * Extracts text content from a PDF file
 * @param file - The PDF file to parse
 * @returns The extracted text content
 * @throws Error if PDF parsing fails
 */
export async function parsePdf(file: File): Promise<string> {
  try {
    // Dynamic import for pdf-parse
    const pdfParseModule = await import('pdf-parse');
    // @ts-ignore - pdf-parse has complex module exports
    const pdfParse = pdfParseModule.default || pdfParseModule;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF and extract text
    const data = await pdfParse(buffer);

    // Return the extracted text content
    return data.text;
  } catch (error) {
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
