import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import Chip from "@/components/Chip";
import {
  profiles,
  getProfile,
  formatDistance,
  formatAgo,
} from "@/lib/data";

export function generateStaticParams() {
  return profiles.map((p) => ({ id: p.id }));
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) notFound();

  return (
    <>
      <Header title={profile.name} back="/" />
      <main className="flex-1 pb-6">
        {/* Hero */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <Avatar profile={profile} rounded="rounded-none" showOnline={false} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white">
                {profile.name}, {profile.age}
              </h2>
              {profile.online ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-online/20 px-2 py-0.5 text-xs font-medium text-online">
                  <span className="h-1.5 w-1.5 rounded-full bg-online" /> Online
                </span>
              ) : (
                <span className="text-xs text-white/70">
                  active {formatAgo(profile.lastActiveMin)} ago
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-white/80">
              {formatDistance(profile.distanceKm)} away · {profile.headline}
            </p>
          </div>
        </div>

        <div className="space-y-5 px-4 py-5">
          <section>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
              About
            </h3>
            <p className="text-sm leading-relaxed text-foreground/90">
              {profile.about}
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Looking for
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.lookingFor.map((l) => (
                <Chip key={l} active>
                  {l}
                </Chip>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </section>

          <p className="pt-2 text-xs text-muted">
            You can always block or report someone from the menu. Distance is
            approximate and never exact.
          </p>
        </div>
      </main>

      {/* Action bar */}
      <div className="sticky bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border text-accent"
            aria-label="Tap"
            title="Send a Tap"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11V6a2 2 0 1 1 4 0v5" />
              <path d="M13 11V4a2 2 0 1 1 4 0v9" />
              <path d="M17 9a2 2 0 1 1 4 0v4a7 7 0 0 1-7 7h-2a7 7 0 0 1-6-3.5L3.5 14a2 2 0 0 1 3.4-2L9 14" />
            </svg>
          </button>
          <Link
            href={`/messages/${profile.id}`}
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-accent font-semibold text-black"
          >
            Message
          </Link>
        </div>
      </div>
    </>
  );
}
