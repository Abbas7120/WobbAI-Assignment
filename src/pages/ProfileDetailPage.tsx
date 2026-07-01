import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { SaveButton } from "@/components/SaveButton";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { formatCount, formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-3 text-left">
      <div className="text-xs text-[var(--text)]">{label}</div>
      <div className="font-semibold text-[var(--text-h)]">{value}</div>
    </div>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") as Platform) || "instagram";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loadedUsername, setLoadedUsername] = useState<string | null>(null);
  const status: "loading" | "loaded" = loadedUsername === username ? "loaded" : "loading";

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    loadProfileByUsername(username).then((data) => {
      if (cancelled) return;
      setProfileData(data);
      setLoadedUsername(username);
    });

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <p>Invalid profile</p>
        <Link to="/" className="text-[var(--accent)] underline">Back</Link>
      </Layout>
    );
  }

  if (status === "loading") {
    return (
      <Layout title={`@${username}`}>
        <p className="text-[var(--text)]">Loading...</p>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-red-500 mb-4">Could not load profile details for {username}</p>
        <Link to="/" className="text-[var(--accent)] underline">← Back to search</Link>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  return (
    <Layout>
      <Link to="/" className="text-sm text-[var(--accent)] mb-6 inline-block">
        ← Back to search
      </Link>

      <div className="flex flex-col sm:flex-row gap-6 items-start text-left max-w-2xl mx-auto">
        <img
          src={user.picture}
          alt={`${user.fullname} avatar`}
          className="w-24 h-24 rounded-full border border-[var(--border)] object-cover mx-auto sm:mx-0"
        />
        <div className="flex-1 w-full">
          <h2 className="text-xl font-bold text-[var(--text-h)] flex items-center">
            @{user.username}
            <VerifiedBadge verified={user.is_verified} />
          </h2>
          <p className="text-[var(--text)]">{user.fullname}</p>
          <p className="text-xs text-[var(--text)] opacity-70 mt-1 capitalize">Platform: {platform}</p>

          {user.description && (
            <p className="mt-3 text-sm text-[var(--text)]">{user.description}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Stat label="Followers" value={formatCount(user.followers)} />
            <Stat
              label="Engagement Rate"
              value={formatEngagementRate(user.engagement_rate)}
            />
            {user.posts_count !== undefined && (
              <Stat label="Posts" value={String(user.posts_count)} />
            )}
            {user.avg_likes !== undefined && (
              <Stat label="Avg Likes" value={formatCount(user.avg_likes)} />
            )}
            {user.avg_comments !== undefined && (
              <Stat label="Avg Comments" value={String(user.avg_comments)} />
            )}
            {user.avg_views !== undefined && user.avg_views > 0 && (
              <Stat label="Avg Views" value={formatCount(user.avg_views)} />
            )}
            {/* Bug fix: this used to re-display the engagement *rate* under a
                field labelled "Engagements"; it now shows the actual engagement
                count, which is the value the field name promises. */}
            {user.engagements !== undefined && (
              <Stat label="Engagements" value={formatCount(user.engagements)} />
            )}
          </div>

          {user.url && (
            <a
              href={user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-[var(--accent)] text-sm"
            >
              View on platform →
            </a>
          )}

          <div className="mt-5">
            <SaveButton
              profile={{
                user_id: user.user_id,
                username: user.username,
                fullname: user.fullname,
                picture: user.picture,
                is_verified: user.is_verified,
                followers: user.followers,
              }}
              platform={platform}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
