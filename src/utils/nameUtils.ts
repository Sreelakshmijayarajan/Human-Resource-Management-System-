/**
 * Extracts the first name from an email address strictly following Dayflow rules:
 * 1. Take the text before '@'.
 * 2. If the username contains '.', '_', or '-', use only the first segment.
 * 3. Convert the first letter to uppercase for display, and remainder to lowercase.
 * 4. Never return last name or second segment.
 *
 * Examples:
 * - arun.kumar@dayflow.com -> Arun
 * - priya.s@dayflow.com -> Priya
 * - rahul@dayflow.com -> Rahul
 * - meena-devi@dayflow.com -> Meena
 * - karthik_r@dayflow.com -> Karthik
 * - PRIYA.S@dayflow.com -> Priya
 */
export function extractFirstNameFromEmail(email: string): string {
  if (!email || typeof email !== 'string') return 'User';
  const trimmed = email.trim();
  if (!trimmed) return 'User';

  // Extract username before @
  const username = trimmed.split('@')[0] || '';
  if (!username) return 'User';

  // Split username by '.', '_', or '-' and take the FIRST segment only
  const firstSegment = username.split(/[._-]/)[0] || '';
  if (!firstSegment) return 'User';

  // Capitalize first letter, lowercase remainder
  return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1).toLowerCase();
}
