import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, SavedProfile } from "@/types";

interface ListState {
  /** Profiles the user has added to their list, keyed by `${platform}:${user_id}`. */
  items: Record<string, SavedProfile>;
  addProfile: (profile: Omit<SavedProfile, "savedAt">) => void;
  removeProfile: (platform: Platform, userId: string) => void;
  toggleProfile: (profile: Omit<SavedProfile, "savedAt">) => void;
  isSaved: (platform: Platform, userId: string) => boolean;
  clear: () => void;
}

function keyFor(platform: Platform, userId: string) {
  return `${platform}:${userId}`;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      items: {},

      addProfile: (profile) => {
        const key = keyFor(profile.platform, profile.user_id);
        set((state) => {
          // Prevent duplicate entries - no-op if already present.
          if (state.items[key]) return state;
          return {
            items: {
              ...state.items,
              [key]: { ...profile, savedAt: Date.now() },
            },
          };
        });
      },

      removeProfile: (platform, userId) => {
        const key = keyFor(platform, userId);
        set((state) => {
          if (!(key in state.items)) return state;
          const next = { ...state.items };
          delete next[key];
          return { items: next };
        });
      },

      toggleProfile: (profile) => {
        const key = keyFor(profile.platform, profile.user_id);
        const exists = Boolean(get().items[key]);
        if (exists) {
          get().removeProfile(profile.platform, profile.user_id);
        } else {
          get().addProfile(profile);
        }
      },

      isSaved: (platform, userId) => Boolean(get().items[keyFor(platform, userId)]),

      clear: () => set({ items: {} }),
    }),
    {
      // Persists to localStorage automatically; survives page refresh.
      name: "wobb-influencer-list",
      version: 1,
    }
  )
);

/** Convenience selector hook returning the saved profiles as a sorted array. */
export function useSavedProfiles(): SavedProfile[] {
  const items = useListStore((s) => s.items);
  return Object.values(items).sort((a, b) => b.savedAt - a.savedAt);
}
