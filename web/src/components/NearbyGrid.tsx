"use client";

import { useMemo, useState } from "react";
import ProfileTile from "./ProfileTile";
import { profiles } from "@/lib/data";

const RADII = [2, 5, 10, 25];

export default function NearbyGrid() {
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [radius, setRadius] = useState(25);

  const shown = useMemo(() => {
    return profiles
      .filter((p) => (onlineOnly ? p.online : true))
      .filter((p) => p.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [onlineOnly, radius]);

  return (
    <div className="px-3 pb-6">
      {/* Filter row */}
      <div className="no-scrollbar -mx-3 flex items-center gap-2 overflow-x-auto px-3 py-3">
        <button
          onClick={() => setOnlineOnly((v) => !v)}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            onlineOnly
              ? "border-online/60 bg-online/15 text-online"
              : "border-border bg-surface-2 text-muted"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-online" />
          Online now
        </button>
        {RADII.map((r) => (
          <button
            key={r}
            onClick={() => setRadius(r)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              radius === r
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-surface-2 text-muted"
            }`}
          >
            {r} km
          </button>
        ))}
      </div>

      <p className="px-1 pb-2 text-xs text-muted">
        {shown.length} {shown.length === 1 ? "person" : "people"} nearby
      </p>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">
          No one matches these filters. Try widening your distance.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {shown.map((p) => (
            <ProfileTile key={p.id} profile={p} />
          ))}
        </div>
      )}
    </div>
  );
}
