import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

// Profiles are extracted once per platform and cached, rather than re-mapped
// on every render of the search page (perf: avoids re-deriving static data).
const profileCache = new Map<Platform, UserProfileSummary[]>();

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const cached = profileCache.get(platform);
  if (cached) return cached;

  const data = getSearchData(platform);
  const profiles = data.accounts.map((item) => item.account.user_profile);
  profileCache.set(platform, profiles);
  return profiles;
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return profiles;

  // Bug fix: username comparison previously wasn't lowercased, so a query
  // like "Cristiano" would never match the (lowercase) "cristiano" username.
  return profiles.filter((p) => {
    const matchUsername = p.username.toLowerCase().includes(trimmed);
    const matchFullname = p.fullname.toLowerCase().includes(trimmed);
    return matchUsername || matchFullname;
  });
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export function getPlatformLabel(platform: Platform): string {
  return PLATFORM_LABELS[platform];
}
