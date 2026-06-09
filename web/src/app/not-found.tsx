import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <div className="text-5xl">📍</div>
      <h1 className="text-xl font-bold">Nothing here</h1>
      <p className="max-w-xs text-sm text-muted">
        This profile or page has moved on. Head back to the grid to see who’s
        nearby.
      </p>
      <Link
        href="/"
        className="mt-2 flex h-11 items-center justify-center rounded-full bg-accent px-6 font-semibold text-black"
      >
        Back to grid
      </Link>
    </main>
  );
}
