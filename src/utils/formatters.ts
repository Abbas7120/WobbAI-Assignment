/** Formats a raw count (followers, likes, etc.) into a compact human-readable string. */
export function formatCount(count: number): string {
  if (count >= 1_000_000_000) return (count / 1_000_000_000).toFixed(1) + "B";
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(1) + "K";
  return count.toString();
}

// Kept for backwards compatibility with the original API name.
export const formatFollowers = formatCount;

/**
 * Formats an engagement rate (stored as a fraction, e.g. 0.000544 = 0.0544%)
 * into a percentage string.
 *
 * Bug fix: the original detail page multiplied by 10,000 instead of 100,
 * inflating every engagement rate by 100x (0.0544% was shown as 5.44%).
 */
export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || Number.isNaN(rate)) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}
