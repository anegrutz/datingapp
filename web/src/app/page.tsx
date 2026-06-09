import Header from "@/components/Header";
import NearbyGrid from "@/components/NearbyGrid";

export default function Home() {
  return (
    <>
      <Header
        title="Proxima"
        subtitle="Downtown · within 25 km"
        right={
          <span
            className="flex items-center gap-1.5 text-xs font-medium text-muted"
            title="Showing your area"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Nearby
          </span>
        }
      />
      <main className="flex-1">
        <NearbyGrid />
      </main>
    </>
  );
}
