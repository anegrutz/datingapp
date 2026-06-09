"use client";

import { useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/data";

export default function ProfileActions({ profile }: { profile: Profile }) {
  const [tapped, setTapped] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [reported, setReported] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  function tap() {
    setTapped((v) => {
      const next = !v;
      showToast(next ? `Tap sent to ${profile.name}` : "Tap removed");
      return next;
    });
  }

  if (blocked) {
    return (
      <div className="sticky bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-4 text-center backdrop-blur">
        <p className="text-sm text-muted">
          You blocked {profile.name}. They can no longer see you or message you.
        </p>
        <Link href="/" className="mt-1 inline-block text-sm font-semibold text-accent">
          Back to grid
        </Link>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
          <div className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg">
            {toast}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            onClick={tap}
            aria-pressed={tapped}
            aria-label={tapped ? "Remove tap" : "Send a tap"}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
              tapped ? "border-accent bg-accent text-black" : "border-border text-accent"
            }`}
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
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="More options"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border text-muted"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Options for ${profile.name}`}
            className="relative w-full max-w-md rounded-t-3xl border border-border bg-surface p-2 pb-6 sm:rounded-3xl"
          >
            <div className="mx-auto my-3 h-1.5 w-10 rounded-full bg-border sm:hidden" />
            <button
              onClick={() => {
                setReported(true);
                setMenuOpen(false);
                showToast(`Report submitted. Our team will review ${profile.name}.`);
              }}
              disabled={reported}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-accent-2 hover:bg-surface-2 disabled:opacity-50"
            >
              <FlagIcon />
              <span className="font-medium">
                {reported ? "Reported" : `Report ${profile.name}`}
              </span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setBlocked(true);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-accent-2 hover:bg-surface-2"
            >
              <BlockIcon />
              <span className="font-medium">Block {profile.name}</span>
            </button>
            <button
              onClick={() => setMenuOpen(false)}
              className="mt-1 flex w-full items-center justify-center rounded-xl px-4 py-3.5 font-medium text-muted hover:bg-surface-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FlagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function BlockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
    </svg>
  );
}
