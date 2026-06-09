import Link from "next/link";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import { conversations, getProfile, formatAgo } from "@/lib/data";

export default function MessagesPage() {
  return (
    <>
      <Header title="Messages" />
      <main className="flex-1">
        <ul className="divide-y divide-border">
          {conversations.map((c) => {
            const p = getProfile(c.id);
            if (!p) return null;
            return (
              <li key={c.id}>
                <Link
                  href={`/messages/${c.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface"
                >
                  <div className="relative h-14 w-14 shrink-0">
                    <Avatar profile={p} rounded="rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold">{p.name}</span>
                      <span className="shrink-0 text-xs text-muted">
                        {formatAgo(c.ago)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`truncate text-sm ${
                          c.unread > 0 ? "font-medium text-foreground" : "text-muted"
                        }`}
                      >
                        {c.lastText}
                      </span>
                      {c.unread > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-black">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="px-4 py-6 text-center text-xs text-muted">
          Tap someone in the grid to start a new conversation.
        </p>
      </main>
    </>
  );
}
