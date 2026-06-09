"use client";

import { useEffect, useRef, useState } from "react";
import { type Message, type Profile, formatAgo } from "@/lib/data";

// Canned replies so the demo "feels" alive without a backend.
const REPLIES = [
  "haha fair",
  "ok you've convinced me",
  "when are you free?",
  "send me the spot 📍",
  "love that",
  "same tbh",
];

export default function ChatThread({
  profile,
  initial,
}: {
  profile: Profile;
  initial: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    const mine: Message = {
      id: `me-${Date.now()}`,
      fromMe: true,
      text: value,
      ago: 0,
    };
    setMessages((m) => [...m, mine]);
    setText("");

    // Simulated reply
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: `them-${Date.now()}`,
          fromMe: false,
          text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
          ago: 0,
        },
      ]);
    }, 1400);
  }

  return (
    <>
      <main className="flex-1 space-y-2 px-4 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[15px] leading-snug ${
                m.fromMe
                  ? "rounded-br-md bg-accent text-black"
                  : "rounded-bl-md bg-surface-2 text-foreground"
              }`}
            >
              {m.text}
              {m.ago > 0 && (
                <span
                  className={`mt-0.5 block text-[10px] ${
                    m.fromMe ? "text-black/50" : "text-muted"
                  }`}
                >
                  {formatAgo(m.ago)} ago
                </span>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-surface-2 px-4 py-3">
              <span className="flex gap-1">
                <Dot /> <Dot /> <Dot />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </main>

      <form
        onSubmit={send}
        className="sticky bottom-0 z-20 border-t border-border bg-surface/95 px-3 py-2.5 backdrop-blur"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message ${profile.name}…`}
            aria-label={`Message ${profile.name}`}
            className="h-11 flex-1 rounded-full border border-border bg-surface-2 px-4 text-[15px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Send"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-black disabled:opacity-40"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>
    </>
  );
}

function Dot() {
  return <span className="h-2 w-2 animate-bounce rounded-full bg-muted" />;
}
