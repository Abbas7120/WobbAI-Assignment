# Influencer Search — Wobb Assignment

A redesigned and refactored version of the starter influencer search app (React + TypeScript + Vite + Tailwind v4).

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint
```

## What I changed

### Bugs fixed
- **Engagement rate was 100x too high.** `ProfileDetailPage` multiplied `engagement_rate` by `10,000` instead of `100` (e.g. a real rate of `0.0544%` was displayed as `5.44%`). Centralized the calculation in `formatEngagementRate` (`src/utils/formatters.ts`) and reused it everywhere.
- **"Engagements" stat showed the engagement *rate* again** instead of the actual `engagements` count — same number as "Engagement Rate", just relabeled. It now formats and shows `user.engagements`.
- **Search was effectively case-sensitive for usernames.** `filterProfiles` lowercased the full name but not the username before comparing, so searching `"Cristiano"` wouldn't match the (lowercase) username `cristiano`. Both fields are now lowercased consistently, and the query is trimmed.
- **Missing `alt` text** on every profile image (accessibility/SEO issue) — added descriptive `alt` attributes throughout.
- **Unused dependency, `react-beautiful-dnd`**, was incompatible with React 19 (peer-dependency conflict on a clean install) and wasn't used anywhere in the code. Removed it.
- **Dead code**: `src/components/SearchBar.tsx` was an unused, near-duplicate of the search input already rendered in `PlatformFilter`. Removed.
- Anchor tags using `target="_blank"` lacked `rel="noopener noreferrer"` (reverse-tabnabbing risk) — fixed.
- The "Add to List" buttons were stubbed out (`disabled`, no handler) on both the card and detail page — fully implemented (see below).

### Feature: Select Profile & Add to List
- Added a Zustand store (`src/store/useListStore.ts`) with the `persist` middleware, keyed by `localStorage` under `wobb-influencer-list`, so the list survives a page refresh.
- Entries are keyed by `platform:user_id`, which naturally **prevents duplicate entries** even if the same username were to exist on a different platform.
- `SaveButton` (`src/components/SaveButton.tsx`) is a shared toggle button used on both the search card and the profile detail page, reflecting saved/unsaved state live from the store.
- `ListDrawer` (`src/components/ListDrawer.tsx`) is a slide-over panel — opened via the "My List" button in the header (with a live count badge) — that **displays all selected profiles** and lets the user **remove** them or jump to their detail page.

### Replaced state management
The starter project didn't yet use React Context anywhere, so there was nothing literal to "replace" — instead, the new global state required by the "Add to List" feature (and any future shared client state) was built directly on **Zustand**, matching the spirit of the requirement: a single, persisted store consumed via small selector hooks rather than prop drilling or Context providers.

### UI/UX redesign
- Replaced the fixed-width (`w-[700px]`), single-column profile list with a responsive **card grid** (1 → 2 → 3 columns) that adapts from mobile to desktop.
- Platform selector is now a proper `role="tablist"` pill control; search input is a separate, reusable `SearchInput` component with a search icon.
- Added a sticky header with the app title and a "My List" entry point (with item count), consistent across both routes via `Layout`.
- Verified badge is now a real inline SVG icon (rather than a checkmark glyph) with accessible labeling.
- Buttons, inputs, and focus states use the existing CSS custom properties (`--accent`, `--border`, `--text`, etc.) already defined in `index.css`, so the redesign respects the existing design tokens and automatically supports the app's light/dark `prefers-color-scheme` theming.
- All interactive elements have visible focus rings (`focus-visible:outline`) and proper `aria-*` attributes (tabs, dialog, pressed/saved state, labelled icons) for accessibility.

### Code quality / structure
- New folders: `src/store` (Zustand stores), `src/hooks` (e.g. `useDebouncedValue`), `src/lib` (small framework-agnostic helpers like `cn`).
- `dataHelpers.ts` now memoizes the per-platform profile extraction (it's static JSON — no need to re-map it on every render).
- Centralized formatting (`formatCount`, `formatEngagementRate`) — previously each component had its own slightly different, occasionally buggy, copy of the same logic.
- Stronger typing: added `SavedProfile`, and the profile detail page now correctly types the `platform` query param as `Platform` instead of an arbitrary string.
- `ProfileCard` is wrapped in `React.memo` since the search results grid can be reasonably large and the card itself is a pure function of its props.

### Performance
- **Debounced search input** (`useDebouncedValue`, 200ms) so filtering only runs after the user pauses typing, instead of on every keystroke.
- **Memoized derived data** (`useMemo` for `allProfiles` / `filtered`) so platform data isn't re-extracted and re-filtered on unrelated re-renders.
- **Memoized `ProfileCard`** to avoid re-rendering the entire grid when only one card's saved-state changes (the `SaveButton` inside each card subscribes to the store directly via a narrow selector, so toggling one card doesn't even re-render its siblings).
- Removed an unused dependency (`react-beautiful-dnd`) from the bundle.

## Libraries added
- **zustand** — lightweight global state management with a `persist` middleware for the saved-list feature.
- **clsx** — tiny utility for conditional className composition (`src/lib/cn.ts`).

## Assumptions
- "List" is a single, flat list of saved profiles (not multiple named lists) per the assignment wording ("Add profiles to a selected list").
- Persistence via `localStorage` is sufficient ("persistent after page refresh") — no backend/auth exists in this starter, so no server-side persistence was added.
- The `platform` for a saved profile is whatever platform it was added from, since the same username could theoretically exist as a different account on a different platform.

## Trade-offs
- No drag-and-drop reordering of the saved list (the original `react-beautiful-dnd` dependency was unused and removed); reordering wasn't in the explicit requirements and `react-beautiful-dnd` is unmaintained/incompatible with React 19. A maintained alternative (e.g. `@dnd-kit`) could be added if reordering becomes a requirement.
- Kept routing, data-loading (`profileLoader.ts`'s `import.meta.glob` pattern), and the overall JSON-as-mock-API approach as-is, since they work well for a static demo and weren't called out as problematic.
- No test suite was added given the scope of the rest of the work; `ProfileList`, `dataHelpers`, and `useListStore` would be the highest-value first targets for unit tests.

## Remaining improvements
- Add unit tests (Vitest + React Testing Library) for the store, filtering logic, and key components.
- Add route-level code splitting if the profile dataset grows significantly.
- Add empty/error states with retry for failed profile loads instead of a static message.
- Consider multiple named lists if that becomes a real product requirement.
