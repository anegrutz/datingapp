"use client";

import { useEffect } from "react";

export type Filters = {
  onlineOnly: boolean;
  radius: number;
  ageMin: number;
  ageMax: number;
  lookingFor: string[];
};

export const DEFAULT_FILTERS: Filters = {
  onlineOnly: false,
  radius: 25,
  ageMin: 18,
  ageMax: 60,
  lookingFor: [],
};

const RADII = [2, 5, 10, 25];
const LOOKING_FOR = ["Friends", "Dates", "Relationship", "Chat", "Networking"];

export default function FilterSheet({
  open,
  value,
  count,
  onChange,
  onClose,
  onReset,
}: {
  open: boolean;
  value: Filters;
  count: number;
  onChange: (next: Filters) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  // Lock body scroll while the sheet is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });
  const toggleLooking = (l: string) =>
    set({
      lookingFor: value.lookingFor.includes(l)
        ? value.lookingFor.filter((x) => x !== l)
        : [...value.lookingFor, l],
    });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="relative w-full max-w-md rounded-t-3xl border border-border bg-surface p-5 pb-7 sm:rounded-3xl"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border sm:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Filters</h2>
          <button
            onClick={onReset}
            className="text-sm font-medium text-muted hover:text-foreground"
          >
            Reset
          </button>
        </div>

        {/* Online */}
        <Section label="Show me">
          <button
            onClick={() => set({ onlineOnly: !value.onlineOnly })}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${
              value.onlineOnly
                ? "border-online/60 bg-online/15 text-online"
                : "border-border bg-surface-2 text-muted"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-online" /> Online now only
          </button>
        </Section>

        {/* Distance */}
        <Section label={`Maximum distance · ${value.radius} km`}>
          <div className="flex gap-2">
            {RADII.map((r) => (
              <button
                key={r}
                onClick={() => set({ radius: r })}
                className={`flex-1 rounded-xl border py-2 text-sm font-medium ${
                  value.radius === r
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border bg-surface-2 text-muted"
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </Section>

        {/* Age */}
        <Section label={`Age · ${value.ageMin}–${value.ageMax}`}>
          <div className="space-y-3">
            <RangeRow
              label="Min"
              val={value.ageMin}
              onChange={(v) => set({ ageMin: Math.min(v, value.ageMax) })}
            />
            <RangeRow
              label="Max"
              val={value.ageMax}
              onChange={(v) => set({ ageMax: Math.max(v, value.ageMin) })}
            />
          </div>
        </Section>

        {/* Looking for */}
        <Section label="Looking for">
          <div className="flex flex-wrap gap-2">
            {LOOKING_FOR.map((l) => {
              const active = value.lookingFor.includes(l);
              return (
                <button
                  key={l}
                  onClick={() => toggleLooking(l)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    active
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-surface-2 text-muted"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </Section>

        <button
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-full bg-accent font-semibold text-black"
        >
          Show {count} {count === 1 ? "person" : "people"}
        </button>
      </div>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </h3>
      {children}
    </div>
  );
}

function RangeRow({
  label,
  val,
  onChange,
}: {
  label: string;
  val: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-8 text-muted">{label}</span>
      <input
        type="range"
        min={18}
        max={60}
        value={val}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-[var(--accent)]"
      />
      <span className="w-8 text-right font-medium tabular-nums">{val}</span>
    </label>
  );
}
