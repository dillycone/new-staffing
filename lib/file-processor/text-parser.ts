/**
 * Text and Markdown file parsing utilities
 * Uses browser File API to extract text content from files
 */

/**
 * Parses a text file and returns its content as a string
 * @param file - The File object to parse
 * @returns Promise resolving to the text content
 * @throws Error if file reading fails
 */
export async function parseText(file: File): Promise<string> {
  try {
    const text = await file.text();
    return text;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to parse text file: ${errorMessage}`);
  }
}

/**
 * Parses a markdown file and returns its content as a string
 * Currently returns raw markdown content without processing
 * @param file - The File object to parse
 * @returns Promise resolving to the markdown content
 * @throws Error if file reading fails
 */
export async function parseMarkdown(file: File): Promise<string> {
  try {
    const markdown = await file.text();
    return markdown;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to parse markdown file: ${errorMessage}`);
  }
}
