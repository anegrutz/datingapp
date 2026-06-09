import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import ChatThread from "@/components/ChatThread";
import {
  profiles,
  getProfile,
  getConversation,
  formatAgo,
} from "@/lib/data";

// Any profile can be messaged, so pre-render a thread for each.
export function generateStaticParams() {
  return profiles.map((p) => ({ id: p.id }));
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) notFound();
  const convo = getConversation(id);

  return (
    <>
      <Header
        title={profile.name}
        back="/messages"
        subtitle={
          profile.online ? "Online now" : `active ${formatAgo(profile.lastActiveMin)} ago`
        }
        right={
          <Link
            href={`/profile/${profile.id}`}
            aria-label={`View ${profile.name}'s profile`}
            className="h-9 w-9 shrink-0"
          >
            <Avatar profile={profile} rounded="rounded-full" showOnline={false} />
          </Link>
        }
      />
      <ChatThread profile={profile} initial={convo?.messages ?? []} />
    </>
  );
}
