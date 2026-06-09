import Link from "next/link";
import Avatar from "./Avatar";
import { type Profile, formatDistance } from "@/lib/data";

// A single tile in the proximity grid.
export default function ProfileTile({ profile }: { profile: Profile }) {
  return (
    <Link
      href={`/profile/${profile.id}`}
      className="group relative aspect-square overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={`${profile.name}, ${profile.age}, ${formatDistance(profile.distanceKm)} away`}
    >
      <Avatar profile={profile} />
      {/* bottom gradient + meta overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <div className="flex items-center gap-1.5">
          {profile.online && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-online" />
          )}
          <span className="truncate text-sm font-semibold text-white">
            {profile.name}
          </span>
        </div>
        <span className="text-xs text-white/80">
          {formatDistance(profile.distanceKm)} away
        </span>
      </div>
    </Link>
  );
}
