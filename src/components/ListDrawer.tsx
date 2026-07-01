import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useListStore, useSavedProfiles } from "@/store/useListStore";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatCount } from "@/utils/formatters";

interface ListDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** Slide-over panel showing the saved profile list, with removal support. */
export function ListDrawer({ open, onClose }: ListDrawerProps) {
  const profiles = useSavedProfiles();
  const removeProfile = useListStore((s) => s.removeProfile);
  const navigate = useNavigate();

  // Close on Escape for keyboard/accessibility support.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20" role="dialog" aria-modal="true" aria-label="Saved profiles">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-[var(--bg)] border-l border-[var(--border)] shadow-[var(--shadow)] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text-h)]">
            My List {profiles.length > 0 && `(${profiles.length})`}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-[var(--text)] hover:text-[var(--text-h)] cursor-pointer"
          >
            <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {profiles.length === 0 ? (
            <p className="text-sm text-[var(--text)] mt-8 text-center">
              No profiles saved yet. Tap "Add to List" on any profile to save it here.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {profiles.map((p) => (
                <li
                  key={`${p.platform}:${p.user_id}`}
                  className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-2.5"
                >
                  <button
                    type="button"
                    className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
                    onClick={() => {
                      onClose();
                      navigate(`/profile/${p.username}?platform=${p.platform}`);
                    }}
                  >
                    <img
                      src={p.picture}
                      alt={`${p.fullname} avatar`}
                      className="w-10 h-10 rounded-full object-cover border border-[var(--border)] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center text-sm font-semibold text-[var(--text-h)] truncate">
                        <span className="truncate">@{p.username}</span>
                        <VerifiedBadge verified={p.is_verified} />
                      </div>
                      <div className="text-xs text-[var(--text)] truncate">
                        {formatCount(p.followers)} followers · {p.platform}
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${p.username} from list`}
                    onClick={() => removeProfile(p.platform, p.user_id)}
                    className="shrink-0 rounded-full p-1.5 text-[var(--text)] hover:text-red-500 cursor-pointer"
                  >
                    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M5 6h10M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m1.5 0-.6 9a1.5 1.5 0 0 1-1.5 1.4H8.6a1.5 1.5 0 0 1-1.5-1.4L6.5 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
