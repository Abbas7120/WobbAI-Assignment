import { useListStore } from "@/store/useListStore";
import type { Platform } from "@/types";
import { cn } from "@/lib/cn";

interface SaveButtonProps {
  profile: {
    user_id: string;
    username: string;
    fullname: string;
    picture: string;
    is_verified: boolean;
    followers: number;
  };
  platform: Platform;
  size?: "sm" | "md";
  /** Stop the click from bubbling up to a parent (e.g. a clickable card). */
  stopPropagation?: boolean;
}

/**
 * Toggle button for adding/removing a profile from the saved list.
 * Backed by the Zustand store, which persists to localStorage.
 */
export function SaveButton({ profile, platform, size = "md", stopPropagation }: SaveButtonProps) {
  const isSaved = useListStore((s) => Boolean(s.items[`${platform}:${profile.user_id}`]));
  const toggleProfile = useListStore((s) => s.toggleProfile);

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    toggleProfile({ ...profile, platform });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${profile.username} from list` : `Add ${profile.username} to list`}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full font-medium border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        isSaved
          ? "bg-[var(--accent)] border-[var(--accent)] text-white hover:opacity-90"
          : "bg-transparent border-[var(--border)] text-[var(--text)] hover:border-[var(--accent-border)] hover:text-[var(--text-h)]"
      )}
    >
      <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
        <path d="M10 17.3 4.6 14.1A4.2 4.2 0 0 1 2.6 10.6 4 4 0 0 1 6.4 6.3c1.4 0 2.7.7 3.6 1.9 1-1.2 2.2-1.9 3.6-1.9a4 4 0 0 1 3.8 4.3 4.2 4.2 0 0 1-2 3.5L10 17.3Z" strokeLinejoin="round" />
      </svg>
      {isSaved ? "Saved" : "Add to List"}
    </button>
  );
}
