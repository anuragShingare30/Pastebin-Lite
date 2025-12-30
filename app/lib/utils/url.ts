/**
 * Get the base URL for the application.
 * Priority:
 * 1. NEXT_PUBLIC_BASE_URL (user-defined, for custom domains)
 * 2. VERCEL_URL (auto-set by Vercel during deployment)
 * 3. Fallback to request origin (for local development)
 */
export function getBaseUrl(requestOrigin?: string): string {
  // User-defined base URL (for custom domains)
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Vercel auto-generated URL (includes https://)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback to request origin (local development)
  return requestOrigin || "http://localhost:3000";
}
