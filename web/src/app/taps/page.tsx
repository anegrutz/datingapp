import Link from "next/link";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import { tapsReceived, getProfile, formatDistance } from "@/lib/data";

export default function TapsPage() {
  const people = tapsReceived
    .map((id) => getProfile(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <Header title="Taps" subtitle="People who showed interest" />
      <main className="flex-1 px-3 py-4">
        <p className="px-1 pb-3 text-sm text-muted">
          {people.length} people tapped you. Tap back to let them know you’re
          interested.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {people.map((p) => (
            <Link
              key={p.id}
              href={`/profile/${p.id}`}
              className="group relative aspect-square overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <Avatar profile={p} />
              <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-black shadow">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11V6a2 2 0 1 1 4 0v5" />
                  <path d="M13 11V4a2 2 0 1 1 4 0v9" />
                  <path d="M17 9a2 2 0 1 1 4 0v4a7 7 0 0 1-7 7h-2a7 7 0 0 1-6-3.5L3.5 14a2 2 0 0 1 3.4-2L9 14" />
                </svg>
              </span>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <span className="block truncate text-sm font-semibold text-white">
                  {p.name}
                </span>
                <span className="text-xs text-white/80">
                  {formatDistance(p.distanceKm)} away
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
