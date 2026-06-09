import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import Chip from "@/components/Chip";
import ProfileActions from "@/components/ProfileActions";
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

      <ProfileActions profile={profile} />
    </>
  );
}
