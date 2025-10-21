/**
 * Keyword matching utilities for resume scoring
 */

import { KeywordMatch } from '@/types/scoring';

/**
 * Match keywords in text and return detailed match information
 * @param text - The text to search in
 * @param keywords - Array of keywords to search for
 * @returns Array of KeywordMatch objects with occurrence details
 */
export function matchKeywords(text: string, keywords: string[]): KeywordMatch[] {
  const matches: KeywordMatch[] = [];
  const lines = text.split('\n');

  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();
    const occurrences: number[] = [];
    const contexts: string[] = [];

    // Search through each line
    lines.forEach((line, index) => {
      const lineLower = line.toLowerCase();
      let searchIndex = 0;

      // Find all occurrences in this line
      while ((searchIndex = lineLower.indexOf(keywordLower, searchIndex)) !== -1) {
        occurrences.push(index + 1); // Line numbers are 1-based

        // Extract context (50 chars before and after)
        const contextStart = Math.max(0, searchIndex - 50);
        const contextEnd = Math.min(line.length, searchIndex + keyword.length + 50);
        const context = line.substring(contextStart, contextEnd).trim();
        contexts.push(context);

        searchIndex += keyword.length;
      }
    });

    // Only add if we found matches
    if (occurrences.length > 0) {
      matches.push({
        keyword,
        occurrences: occurrences.length,
        lineNumbers: occurrences,
        contexts,
      });
    }
  }

  return matches;
}

/**
 * Check if text contains any of the keywords (case-insensitive)
 * @param text - The text to search in
 * @param keywords - Array of keywords to search for
 * @returns True if any keyword is found
 */
export function hasAnyKeyword(text: string, keywords: string[]): boolean {
  const textLower = text.toLowerCase();
  return keywords.some(keyword => textLower.includes(keyword.toLowerCase()));
}

/**
 * Check if text contains all of the keywords (case-insensitive)
 * @param text - The text to search in
 * @param keywords - Array of keywords to search for
 * @returns True if all keywords are found
 */
export function hasAllKeywords(text: string, keywords: string[]): boolean {
  const textLower = text.toLowerCase();
  return keywords.every(keyword => textLower.includes(keyword.toLowerCase()));
}

/**
 * Count how many keywords from the list are present in the text
 * @param text - The text to search in
 * @param keywords - Array of keywords to search for
 * @returns Number of keywords found
 */
export function countKeywords(text: string, keywords: string[]): number {
  const textLower = text.toLowerCase();
  return keywords.filter(keyword => textLower.includes(keyword.toLowerCase())).length;
}

/**
 * Extract which keywords from the list are present in the text
 * @param text - The text to search in
 * @param keywords - Array of keywords to search for
 * @returns Array of keywords that were found
 */
export function extractMatchedKeywords(text: string, keywords: string[]): string[] {
  const textLower = text.toLowerCase();
  return keywords.filter(keyword => textLower.includes(keyword.toLowerCase()));
}
