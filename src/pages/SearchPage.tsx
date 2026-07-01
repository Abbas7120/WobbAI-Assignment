import { useCallback, useMemo, useState } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { SearchInput } from "@/components/SearchInput";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 200);

  // Re-derive only when platform or the (debounced) query actually changes,
  // instead of filtering on every keystroke render.
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(
    () => filterProfiles(allProfiles, debouncedQuery),
    [allProfiles, debouncedQuery]
  );

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  }, []);

  const handleProfileClick = useCallback((username: string) => {
    // Hook left in for future analytics; intentionally side-effect free here.
    void username;
  }, []);

  return (
    <Layout title="Find Influencers" subtitle="Browse top creators across social platforms">
      <div className="flex flex-col items-center gap-4 mb-6">
        <PlatformFilter selected={platform} onChange={handlePlatformChange} />
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>

      <p className="text-sm text-[var(--text)] mb-4">
        Showing {filtered.length} of {allProfiles.length} on{" "}
        <span className="capitalize">{platform}</span>
      </p>

      <ProfileList profiles={filtered} platform={platform} onProfileClick={handleProfileClick} />
    </Layout>
  );
}
