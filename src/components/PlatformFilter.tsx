import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { cn } from "@/lib/cn";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
}

export function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter by platform"
      className="inline-flex gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--code-bg)]"
    >
      {PLATFORMS.map((p) => {
        const isActive = selected === p;
        return (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(p)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
              isActive
                ? "bg-[var(--text-h)] text-[var(--bg)]"
                : "text-[var(--text)] hover:text-[var(--text-h)]"
            )}
          >
            {getPlatformLabel(p)}
          </button>
        );
      })}
    </div>
  );
}
