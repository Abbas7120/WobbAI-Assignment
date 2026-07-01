import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { SaveButton } from "./SaveButton";
import { formatCount } from "@/utils/formatters";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  onProfileClick?: (username: string) => void;
}

function ProfileCardImpl({ profile, platform, onProfileClick }: ProfileCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    onProfileClick?.(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`View profile of ${profile.fullname}`}
      className="group flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <div className="flex items-center gap-3">
        <img
          src={profile.picture}
          alt={`${profile.fullname} avatar`}
          loading="lazy"
          className="w-12 h-12 rounded-full object-cover border border-[var(--border)] shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center font-semibold text-[var(--text-h)] truncate">
            <span className="truncate">@{profile.username}</span>
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <div className="text-sm text-[var(--text)] truncate">{profile.fullname}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-h)]">
          {formatCount(profile.followers)} <span className="font-normal text-[var(--text)]">followers</span>
        </span>
        <SaveButton
          profile={profile}
          platform={platform}
          size="sm"
          stopPropagation
        />
      </div>
    </div>
  );
}

// Memoized: with potentially large result sets, avoid re-rendering every
// card when unrelated parent state (e.g. the live search query) changes.
export const ProfileCard = memo(ProfileCardImpl);
