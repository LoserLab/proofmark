/**
 * Viewer ID generation utility
 * Generates short, random, non-guessable viewer IDs for share links
 */

/**
 * Generate a short, random viewer ID
 * Format: 4 alphanumeric characters (e.g., "A3F9")
 * Non-guessable and neutral
 */
export function generateViewerId(): string {
  // Use alphanumeric characters (excluding confusing ones like 0, O, I, l)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}
