import Header from "@/components/Header";
import Chip from "@/components/Chip";
import SettingToggle from "@/components/SettingToggle";

const me = {
  name: "You",
  age: 27,
  headline: "Set up your profile to get started",
  gradient: ["#f5a623", "#ff5a5f"] as [string, string],
  tags: ["Coffee", "Hiking", "Indie films", "Cooking"],
};

export default function MePage() {
  const [from, to] = me.gradient;
  return (
    <>
      <Header title="Profile" />
      <main className="flex-1 pb-8">
        <div className="flex items-center gap-4 px-4 py-5">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
          >
            <span className="text-3xl font-bold text-white/90">
              {me.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold">
              {me.name}, {me.age}
            </h2>
            <p className="truncate text-sm text-muted">{me.headline}</p>
          </div>
        </div>

        <div className="px-4">
          <button className="h-11 w-full rounded-full border border-accent text-sm font-semibold text-accent">
            Edit profile
          </button>
        </div>

        <section className="px-4 py-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Your interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {me.tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </section>

        <section className="py-2">
          <h3 className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">
            Privacy & safety
          </h3>
          <div className="divide-y divide-border border-y border-border bg-surface">
            <SettingToggle
              label="Show my distance"
              description="Others see approximate distance, never exact location."
              defaultOn
            />
            <SettingToggle
              label="Show when I'm online"
              description="Display an online indicator on your profile."
              defaultOn
            />
            <SettingToggle
              label="Incognito mode"
              description="Browse without appearing in the grid."
            />
            <SettingToggle
              label="Read receipts"
              description="Let people know when you've read their message."
              defaultOn
            />
          </div>
        </section>

        <section className="py-2">
          <h3 className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">
            Account
          </h3>
          <div className="divide-y divide-border border-y border-border bg-surface">
            <Row label="Blocked users" />
            <Row label="Verify my photo" badge="Recommended" />
            <Row label="Help & safety center" />
            <Row label="Log out" danger />
          </div>
        </section>

        <p className="px-4 pt-4 text-center text-xs text-muted">
          Proxima · prototype build · v0.1
        </p>
      </main>
    </>
  );
}

function Row({
  label,
  badge,
  danger,
}: {
  label: string;
  badge?: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 text-sm ${
        danger ? "text-accent-2" : ""
      }`}
    >
      <span className="font-medium">{label}</span>
      {badge ? (
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
          {badge}
        </span>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </div>
  );
}
