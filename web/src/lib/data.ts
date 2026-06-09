// Mock data layer for the Proxima prototype.
// In production this is replaced by the API (nearby grid, chat, taps) described
// in PLAN.md. Avatars are generated gradients (no real photos) so the prototype
// is self-contained and ships no personal data.

export type Profile = {
  id: string;
  name: string;
  age: number;
  distanceKm: number;
  online: boolean;
  lastActiveMin: number; // minutes since last active
  headline: string;
  about: string;
  tags: string[];
  lookingFor: string[];
  gradient: [string, string];
};

export type Message = {
  id: string;
  fromMe: boolean;
  text: string;
  // minutes ago
  ago: number;
};

export type Conversation = {
  id: string; // matches a profile id
  lastText: string;
  unread: number;
  ago: number;
  messages: Message[];
};

const G: Record<string, [string, string]> = {
  amber: ["#f5a623", "#ff5a5f"],
  violet: ["#8b5cf6", "#ec4899"],
  ocean: ["#06b6d4", "#3b82f6"],
  lime: ["#84cc16", "#10b981"],
  sunset: ["#f97316", "#db2777"],
  steel: ["#64748b", "#0ea5e9"],
  rose: ["#fb7185", "#a855f7"],
  gold: ["#eab308", "#f97316"],
};

export const profiles: Profile[] = [
  {
    id: "alex",
    name: "Alex",
    age: 28,
    distanceKm: 0.2,
    online: true,
    lastActiveMin: 0,
    headline: "Coffee, climbing, and bad puns",
    about:
      "Software person by day, boulderer by night. Looking to meet people nearby for coffee and maybe a belay partner.",
    tags: ["Climbing", "Coffee", "Tech", "Dogs"],
    lookingFor: ["Friends", "Dates"],
    gradient: G.amber,
  },
  {
    id: "sam",
    name: "Sam",
    age: 31,
    distanceKm: 0.6,
    online: true,
    lastActiveMin: 0,
    headline: "New in town 👋",
    about: "Just moved here. Show me the good food spots?",
    tags: ["Foodie", "Travel", "Live music"],
    lookingFor: ["Friends", "Dates"],
    gradient: G.violet,
  },
  {
    id: "jordan",
    name: "Jordan",
    age: 26,
    distanceKm: 1.1,
    online: false,
    lastActiveMin: 14,
    headline: "Gym in the morning, films at night",
    about: "Marvel debates welcome. Gym buddy a plus.",
    tags: ["Fitness", "Movies", "Gaming"],
    lookingFor: ["Chat", "Dates"],
    gradient: G.ocean,
  },
  {
    id: "riley",
    name: "Riley",
    age: 34,
    distanceKm: 1.8,
    online: true,
    lastActiveMin: 0,
    headline: "Plant dad with too many succulents",
    about: "Sunday markets, vinyl, and slow mornings.",
    tags: ["Plants", "Vinyl", "Markets", "Cats"],
    lookingFor: ["Dates", "Relationship"],
    gradient: G.lime,
  },
  {
    id: "casey",
    name: "Casey",
    age: 29,
    distanceKm: 2.4,
    online: false,
    lastActiveMin: 52,
    headline: "Designer. Probably at a gallery.",
    about: "Always chasing good light and good ramen.",
    tags: ["Design", "Art", "Ramen", "Photography"],
    lookingFor: ["Friends", "Networking"],
    gradient: G.sunset,
  },
  {
    id: "morgan",
    name: "Morgan",
    age: 37,
    distanceKm: 3.0,
    online: true,
    lastActiveMin: 0,
    headline: "Runner, reader, occasional baker",
    about: "Training for a half marathon. Recommend me a book?",
    tags: ["Running", "Books", "Baking"],
    lookingFor: ["Friends", "Dates"],
    gradient: G.steel,
  },
  {
    id: "taylor",
    name: "Taylor",
    age: 24,
    distanceKm: 3.7,
    online: false,
    lastActiveMin: 120,
    headline: "Music producer • night owl",
    about: "Studio most nights. Send me your playlists.",
    tags: ["Music", "Production", "Synths"],
    lookingFor: ["Chat", "Collab"],
    gradient: G.rose,
  },
  {
    id: "drew",
    name: "Drew",
    age: 33,
    distanceKm: 4.5,
    online: true,
    lastActiveMin: 0,
    headline: "Cyclist & home cook",
    about: "Weekend rides and Sunday roasts. Bring an appetite.",
    tags: ["Cycling", "Cooking", "Wine"],
    lookingFor: ["Dates", "Relationship"],
    gradient: G.gold,
  },
  {
    id: "noah",
    name: "Noah",
    age: 27,
    distanceKm: 5.2,
    online: false,
    lastActiveMin: 8,
    headline: "Surf when I can, code when I must",
    about: "Salt water solves most things.",
    tags: ["Surf", "Tech", "Beach"],
    lookingFor: ["Friends", "Dates"],
    gradient: G.ocean,
  },
  {
    id: "leo",
    name: "Leo",
    age: 30,
    distanceKm: 6.0,
    online: true,
    lastActiveMin: 0,
    headline: "Chef. Feed people, that's the whole bio.",
    about: "Tasting menus and dive bars in equal measure.",
    tags: ["Food", "Cooking", "Travel"],
    lookingFor: ["Dates"],
    gradient: G.sunset,
  },
  {
    id: "kai",
    name: "Kai",
    age: 25,
    distanceKm: 7.1,
    online: false,
    lastActiveMin: 200,
    headline: "Skater & illustrator",
    about: "Drawing weird little guys all day.",
    tags: ["Skating", "Art", "Anime"],
    lookingFor: ["Friends", "Chat"],
    gradient: G.violet,
  },
  {
    id: "max",
    name: "Max",
    age: 35,
    distanceKm: 8.4,
    online: true,
    lastActiveMin: 0,
    headline: "Dog dad • hiker • bad at bios",
    about: "Two huskies run my life. Trail recs welcome.",
    tags: ["Hiking", "Dogs", "Camping"],
    lookingFor: ["Dates", "Relationship"],
    gradient: G.lime,
  },
];

export const conversations: Conversation[] = [
  {
    id: "sam",
    lastText: "ok the tacos place wins, see you at 8?",
    unread: 2,
    ago: 4,
    messages: [
      { id: "m1", fromMe: false, text: "hey! you said you know the good food spots 👀", ago: 40 },
      { id: "m2", fromMe: true, text: "i do. tacos or ramen?", ago: 36 },
      { id: "m3", fromMe: false, text: "tacos, obviously", ago: 30 },
      { id: "m4", fromMe: true, text: "respect. there's a place 5 min from you", ago: 12 },
      { id: "m5", fromMe: false, text: "ok the tacos place wins, see you at 8?", ago: 4 },
    ],
  },
  {
    id: "riley",
    lastText: "haha no way, which succulent",
    unread: 0,
    ago: 55,
    messages: [
      { id: "m1", fromMe: true, text: "your profile said too many succulents. relatable", ago: 70 },
      { id: "m2", fromMe: false, text: "haha no way, which succulent", ago: 55 },
    ],
  },
  {
    id: "max",
    lastText: "the huskies approve of this plan",
    unread: 0,
    ago: 180,
    messages: [
      { id: "m1", fromMe: false, text: "trail rec: eagle ridge, sunrise loop", ago: 200 },
      { id: "m2", fromMe: true, text: "adding it. bringing coffee?", ago: 190 },
      { id: "m3", fromMe: false, text: "the huskies approve of this plan", ago: 180 },
    ],
  },
];

// Taps (lightweight interest signals) received — profile ids
export const tapsReceived: string[] = ["jordan", "drew", "leo", "noah", "casey"];

export function getProfile(id: string): Profile | undefined {
  return profiles.find((p) => p.id === id);
}

export function getConversation(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function formatAgo(min: number): string {
  if (min <= 0) return "now";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
