import type { Profile } from "@/lib/data";

// Gradient avatar with the person's initial. Used everywhere instead of photos
// so the prototype carries no real images/personal data.
export default function Avatar({
  profile,
  rounded = "rounded-2xl",
  showOnline = true,
}: {
  profile: Pick<Profile, "name" | "gradient" | "online">;
  rounded?: string;
  showOnline?: boolean;
}) {
  const [from, to] = profile.gradient;
  return (
    <div className={`relative h-full w-full overflow-hidden ${rounded}`}>
      <div
        className="flex h-full w-full items-center justify-center"
        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
        aria-hidden
      >
        <span className="text-4xl font-bold text-white/90 drop-shadow">
          {profile.name.charAt(0)}
        </span>
      </div>
      {showOnline && profile.online && (
        <span
          className="absolute right-2 top-2 h-3 w-3 rounded-full border-2 border-black/40 bg-online"
          title="Online now"
        />
      )}
    </div>
  );
}
