import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  onProfileClick: (username: string) => void;
}

export function ProfileList({ profiles, platform, onProfileClick }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-[var(--text)]">
        <svg viewBox="0 0 24 24" className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <p>No profiles found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          onProfileClick={onProfileClick}
        />
      ))}
    </div>
  );
}
