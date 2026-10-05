import type { Client, ClientFormula, ClientNote } from "@/types/domain";
import { staff } from "./catalog.ts";
const first = [
  "Emma",
  "Olivia",
  "Chloe",
  "Maya",
  "Sofia",
  "Amelia",
  "Isabella",
  "Noah",
  "Liam",
  "Lucas",
  "Charlotte",
  "Harper",
  "Evelyn",
  "Luna",
  "Aria",
  "Scarlett",
  "Hazel",
  "Violet",
  "Eleanor",
  "Zoe",
];
const last = [
  "Walker",
  "Martin",
  "Bennett",
  "Patel",
  "Garcia",
  "Thompson",
  "Reed",
  "Wilson",
  "Carter",
  "Brown",
  "Anderson",
  "Mitchell",
  "Roberts",
  "Williams",
  "Parker",
  "Campbell",
  "Brooks",
  "Collins",
  "Rivera",
  "Morgan",
];
export const clients: Client[] = Array.from({ length: 80 }, (_, i) => ({
  id: i === 0 ? "emma-walker" : `client-${i + 1}`,
  name: `${first[i % 20]} ${last[(i + Math.floor(i / 20) * 7) % 20]}`,
  email: `${first[i % 20].toLowerCase()}.${last[(i + Math.floor(i / 20) * 7) % 20].toLowerCase()}${i > 19 ? i : ""}@example.com`,
  phone: `(212) 555-${String(1000 + i).slice(-4)}`,
  birthday: `199${i % 10}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 25) + 1).padStart(2, "0")}`,
  joined: "2024-01-12",
  locationId: i < 50 ? "downtown" : i < 65 ? "westside" : "marina",
  staffId: staff[i % 10].id,
  tags:
    i === 0
      ? ["VIP", "Blonde", "Membership"]
      : i % 7 === 0
        ? ["VIP"]
        : i % 5 === 0
          ? ["Membership"]
          : i > 70
            ? ["New Client"]
            : [],
  visits: i === 0 ? 12 : 2 + (i % 18),
  openingSpend: i === 0 ? 2840 : 180 + i * 37,
  lastVisit:
    i === 0 ? "2026-09-20" : `2026-09-${String((i % 28) + 1).padStart(2, "0")}`,
  preferences:
    i === 0
      ? "Soft, lived-in blonde. Prefers a quiet appointment and a warm towel finish."
      : "Prefers a consultation before each service.",
  sensitivities:
    i === 0
      ? "Sensitive scalp. Use gentle, fragrance-free products when possible."
      : "None noted",
  communication: i % 2 === 0 ? "SMS" : "Email",
  credit: i === 0 ? 45 : 0,
  noShows: i === 0 ? 1 : 0,
  referrals: i === 0 ? 3 : i % 3,
  status: i > 74 ? "inactive" : "active",
}));
export const notes: ClientNote[] = [
  {
    id: "note-1",
    clientId: "emma-walker",
    kind: "Service",
    text: "Loved the warmer finish. Keep face-framing pieces soft at the next visit.",
    staffId: "mia-carter",
    date: "2026-09-20T14:00:00",
  },
  {
    id: "note-2",
    clientId: "emma-walker",
    kind: "General",
    text: "Prefers morning appointments. Offer an oat milk latte on arrival.",
    staffId: "sophia-reed",
    date: "2026-08-13T10:00:00",
  },
  {
    id: "note-3",
    clientId: "emma-walker",
    kind: "Internal",
    text: "Discussed an eight-week color maintenance plan and home care routine.",
    staffId: "mia-carter",
    date: "2026-09-20T14:05:00",
  },
];
export const formulas: ClientFormula[] = [
  {
    id: "formula-1",
    clientId: "emma-walker",
    staffId: "mia-carter",
    date: "2026-09-20",
    root: "6N + 6A · 1:1",
    lengths: "7N gloss · soft beige",
    developer: "20 vol",
    processing: 35,
  },
  {
    id: "formula-2",
    clientId: "emma-walker",
    staffId: "mia-carter",
    date: "2026-07-25",
    root: "6N + 7A · 1:1",
    lengths: "8N gloss · warm blonde",
    developer: "20 vol",
    processing: 30,
  },
];
