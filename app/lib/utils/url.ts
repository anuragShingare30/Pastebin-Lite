/**
 * Get the base URL for the application.
 * Uses NEXT_PUBLIC_BASE_URL environment variable for production.
 */
export function getBaseUrl(requestOrigin?: string): string {
  // Use environment variable for deployed URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Fallback to request origin (local development)
  return requestOrigin || "http://localhost:3000";
}
