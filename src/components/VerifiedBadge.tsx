interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className="inline-block w-4 h-4 ml-1 text-[var(--accent)] align-text-bottom"
      fill="currentColor"
      role="img"
      aria-label="Verified account"
    >
      <title>Verified</title>
      <path d="M12 2 14.5 4.5 18 4l.5 3.5L22 9l-2 3 2 3-3.5 1.5L18 20l-3.5-.5L12 22l-2.5-2.5L6 20l-.5-3.5L2 15l2-3-2-3 3.5-1.5L6 4l3.5.5L12 2Z" />
      <path d="m9.5 12.3 1.8 1.8 3.4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
