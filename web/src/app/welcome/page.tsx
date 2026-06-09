"use client";

import { useState } from "react";
import Link from "next/link";

const GRADIENTS: [string, string][] = [
  ["#f5a623", "#ff5a5f"],
  ["#8b5cf6", "#ec4899"],
  ["#06b6d4", "#3b82f6"],
  ["#84cc16", "#10b981"],
  ["#f97316", "#db2777"],
  ["#fb7185", "#a855f7"],
];

const STEPS = ["Account", "Age", "Location", "Profile"] as const;

export default function Welcome() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [over18, setOver18] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [name, setName] = useState("");
  const [gradient, setGradient] = useState(0);

  const canNext =
    (step === 0 && /\S+@\S+\.\S+/.test(email)) ||
    (step === 1 && over18) ||
    (step === 2 && locationGranted) ||
    (step === 3 && name.trim().length > 0);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));

  return (
    <div className="flex min-h-full flex-1 flex-col px-6 pb-10 pt-8">
      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-accent" : "bg-surface-2"
            }`}
          />
        ))}
      </div>

      <div className="flex-1">
        {step === 0 && (
          <StepShell
            title="Welcome to Proxima"
            subtitle="Meet people nearby. Create your account to get started."
          >
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-surface-2 px-4 text-[15px] focus:border-accent focus:outline-none"
            />
            <p className="mt-3 text-xs text-muted">
              By continuing you agree to our Terms and Privacy Policy. You must
              be 18 or older to use Proxima.
            </p>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell
            title="Confirm your age"
            subtitle="Proxima is for adults only. Please confirm you're 18 or older."
          >
            <button
              onClick={() => setOver18((v) => !v)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left ${
                over18
                  ? "border-accent bg-accent/10"
                  : "border-border bg-surface-2"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  over18 ? "border-accent bg-accent text-black" : "border-muted"
                }`}
              >
                {over18 && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium">
                I confirm I am 18 years of age or older
              </span>
            </button>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell
            title="Enable location"
            subtitle="Proxima uses your location to show people nearby. Your exact position is never shared — only approximate distance."
          >
            <button
              onClick={() => setLocationGranted(true)}
              className={`flex w-full flex-col items-center gap-3 rounded-2xl border px-4 py-8 ${
                locationGranted
                  ? "border-online/60 bg-online/10"
                  : "border-border bg-surface-2"
              }`}
            >
              <span className="text-4xl">📍</span>
              <span className="text-sm font-semibold">
                {locationGranted ? "Location enabled" : "Allow location access"}
              </span>
            </button>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            title="Set up your profile"
            subtitle="Pick an avatar colour and add a display name."
          >
            <div
              className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                backgroundImage: `linear-gradient(135deg, ${GRADIENTS[gradient][0]}, ${GRADIENTS[gradient][1]})`,
              }}
            >
              <span className="text-3xl font-bold text-white/90">
                {name.trim().charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            <div className="mb-4 flex justify-center gap-2">
              {GRADIENTS.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setGradient(i)}
                  aria-label={`Avatar colour ${i + 1}`}
                  className={`h-8 w-8 rounded-full ring-2 ${
                    gradient === i ? "ring-accent" : "ring-transparent"
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${g[0]}, ${g[1]})`,
                  }}
                />
              ))}
            </div>
            <input
              placeholder="Display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-surface-2 px-4 text-[15px] focus:border-accent focus:outline-none"
            />
          </StepShell>
        )}
      </div>

      {/* Footer actions */}
      <div className="space-y-3">
        {step < STEPS.length - 1 ? (
          <button
            disabled={!canNext}
            onClick={next}
            className="h-12 w-full rounded-full bg-accent font-semibold text-black disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <Link
            href="/"
            aria-disabled={!canNext}
            className={`flex h-12 w-full items-center justify-center rounded-full bg-accent font-semibold text-black ${
              canNext ? "" : "pointer-events-none opacity-40"
            }`}
          >
            Enter Proxima
          </Link>
        )}
        {step === 0 && (
          <Link
            href="/"
            className="block text-center text-sm text-muted hover:text-foreground"
          >
            Skip — just browse the demo
          </Link>
        )}
      </div>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
      {children}
    </div>
  );
}
