import Header from "@/components/Header";
import NearbyGrid from "@/components/NearbyGrid";

export default function Home() {
  return (
    <>
      <Header
        title="Proxima"
        subtitle="Downtown · within 25 km"
        right={
          <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
            Demo
          </span>
        }
      />
      <main className="flex-1">
        <NearbyGrid />
      </main>
    </>
  );
}
