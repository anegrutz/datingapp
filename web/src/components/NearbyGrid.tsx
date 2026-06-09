"use client";

import { useEffect, useMemo, useState } from "react";
import ProfileTile from "./ProfileTile";
import FilterSheet, { DEFAULT_FILTERS, type Filters } from "./FilterSheet";
import { profiles } from "@/lib/data";

function applyFilters(f: Filters) {
  return profiles
    .filter((p) => (f.onlineOnly ? p.online : true))
    .filter((p) => p.distanceKm <= f.radius)
    .filter((p) => p.age >= f.ageMin && p.age <= f.ageMax)
    .filter((p) =>
      f.lookingFor.length === 0
        ? true
        : p.lookingFor.some((l) => f.lookingFor.includes(l)),
    )
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export default function NearbyGrid() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Brief skeleton so the grid feels like it's locating people.
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(t);
  }, []);

  const shown = useMemo(() => applyFilters(filters), [filters]);
  const preview = useMemo(() => applyFilters(filters).length, [filters]);

  const activeCount =
    (filters.onlineOnly ? 1 : 0) +
    (filters.radius !== DEFAULT_FILTERS.radius ? 1 : 0) +
    (filters.ageMin !== DEFAULT_FILTERS.ageMin ||
    filters.ageMax !== DEFAULT_FILTERS.ageMax
      ? 1
      : 0) +
    filters.lookingFor.length;

  return (
    <div className="px-3 pb-6">
      {/* Quick filter row */}
      <div className="no-scrollbar -mx-3 flex items-center gap-2 overflow-x-auto px-3 py-3">
        <button
          onClick={() => setSheetOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-black">
              {activeCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilters((f) => ({ ...f, onlineOnly: !f.onlineOnly }))}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
            filters.onlineOnly
              ? "border-online/60 bg-online/15 text-online"
              : "border-border bg-surface-2 text-muted"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-online" />
          Online now
        </button>
      </div>

      {loading ? (
        <Skeleton />
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">
          No one matches these filters.
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="mt-3 block w-full text-sm font-semibold text-accent"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="px-1 pb-2 text-xs text-muted">
            {shown.length} {shown.length === 1 ? "person" : "people"} nearby
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {shown.map((p) => (
              <ProfileTile key={p.id} profile={p} />
            ))}
          </div>
        </>
      )}

      <FilterSheet
        open={sheetOpen}
        value={filters}
        count={preview}
        onChange={setFilters}
        onClose={() => setSheetOpen(false)}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" aria-hidden>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square animate-pulse rounded-2xl bg-surface-2"
        />
      ))}
    </div>
  );
}
