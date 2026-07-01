import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useListStore } from "@/store/useListStore";
import { ListDrawer } from "./ListDrawer";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const count = useListStore((s) => Object.keys(s.items).length);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-[var(--text-h)]">
            Influencer Search
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-h)] hover:border-[var(--accent-border)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            aria-haspopup="dialog"
          >
            My List
            {count > 0 && (
              <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-xs font-semibold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-5xl w-full mx-auto">
        {title && (
          <div className="mb-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--text-h)]">{title}</h1>
            {subtitle && <p className="mt-2 text-[var(--text)]">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>

      <ListDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
