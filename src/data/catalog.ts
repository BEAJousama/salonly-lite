import type {
  Location,
  MembershipPlan,
  Package,
  Product,
  Resource,
  Service,
  StaffMember,
  Supplier,
} from "@/types/domain";
export const locations: Location[] = [
  {
    id: "downtown",
    name: "Downtown Studio",
    address: "128 Spring Street, New York, NY",
    phone: "(212) 555-0100",
  },
  {
    id: "westside",
    name: "Westside Salon",
    address: "46 West 72nd Street, New York, NY",
    phone: "(212) 555-0120",
  },
  {
    id: "marina",
    name: "Marina Spa",
    address: "8 Harbor Walk, Brooklyn, NY",
    phone: "(718) 555-0130",
  },
];
const serviceSeed: [string, string, number, number][] = [
  ["Balayage", "Color", 120, 220],
  ["Blow Dry", "Hair", 30, 45],
  ["Women's Haircut", "Hair", 60, 75],
  ["Men's Haircut", "Barber", 30, 40],
  ["Full Highlights", "Color", 120, 195],
  ["Root Touch-Up", "Color", 75, 95],
  ["Deep Conditioning", "Hair", 30, 35],
  ["Gel Manicure", "Nails", 45, 55],
  ["Classic Pedicure", "Nails", 60, 65],
  ["Nail Art", "Nails", 15, 15],
  ["Classic Facial", "Facial", 60, 85],
  ["Hydrating Facial", "Facial", 75, 110],
  ["Deep Tissue Massage", "Massage", 60, 120],
  ["Swedish Massage", "Massage", 60, 100],
  ["Brow Shape", "Brows", 20, 25],
  ["Brow Tint", "Brows", 20, 30],
  ["Lash Lift", "Lashes", 60, 90],
  ["Makeup Session", "Makeup", 60, 120],
  ["Beard Trim", "Barber", 20, 25],
  ["Hot Towel Shave", "Barber", 30, 35],
  ["Scalp Treatment", "Hair", 30, 45],
  ["Gloss & Tone", "Color", 45, 70],
  ["French Manicure", "Nails", 60, 65],
  ["Builder Gel", "Nails", 75, 80],
  ["Express Facial", "Facial", 30, 50],
  ["Sculpting Facial", "Facial", 90, 145],
  ["Aromatherapy Massage", "Massage", 90, 155],
  ["Hot Stone Massage", "Massage", 90, 165],
  ["Brow Lamination", "Brows", 45, 65],
  ["Lash Tint", "Lashes", 30, 35],
  ["Bridal Makeup", "Makeup", 90, 195],
  ["Event Styling", "Hair", 60, 85],
  ["Full Leg Wax", "Waxing", 45, 60],
  ["Underarm Wax", "Waxing", 15, 20],
  ["Mindful Head Massage", "Wellness", 30, 50],
  ["Restorative Body Ritual", "Wellness", 90, 170],
];
export const services: Service[] = serviceSeed.map(
  ([name, category, duration, price], i) => ({
    id: `svc-${i + 1}`,
    name,
    category,
    duration,
    price,
    cost: Math.round(price * 0.12),
    tax: 0.06,
    buffer: ["Massage", "Facial"].includes(category) ? 15 : 0,
    online: true,
    locationIds: locations.map((l) => l.id),
    variants:
      i === 2
        ? [
            { name: "Short hair", price: 65, duration: 45 },
            { name: "Medium hair", price: 75, duration: 60 },
            { name: "Long hair", price: 85, duration: 75 },
          ]
        : category === "Massage"
          ? [
              { name: "30 minutes", price: 70, duration: 30 },
              { name: "60 minutes", price, duration: 60 },
              { name: "90 minutes", price: price + 45, duration: 90 },
            ]
          : [],
    addons: [
      {
        id: "addon-conditioning",
        name: "Deep Conditioning",
        price: 25,
        duration: 15,
      },
      { id: "addon-scalp", name: "Scalp Treatment", price: 30, duration: 20 },
    ].filter(() => category === "Hair" || category === "Color"),
  }),
);
const team: [string, string, string[], string][] = [
  ["Mia Carter", "Senior Colorist", ["Hair", "Color"], "clay"],
  ["Sophia Reed", "Hair Stylist", ["Hair", "Color"], "sage"],
  ["Ava Brooks", "Nail Technician", ["Nails"], "mauve"],
  ["Lucas Hill", "Massage Therapist", ["Massage", "Wellness"], "sand"],
  ["Nora Bennett", "Esthetician", ["Facial", "Brows", "Waxing"], "sage"],
  ["Leo Martin", "Senior Barber", ["Barber", "Hair"], "slate"],
  ["Ella Moore", "Makeup Artist", ["Makeup", "Lashes", "Brows"], "mauve"],
  ["Isla James", "Hair Stylist", ["Hair", "Color"], "clay"],
  ["Ruby Chen", "Nail Technician", ["Nails"], "sand"],
  ["Oliver Hayes", "Massage Therapist", ["Massage", "Wellness"], "slate"],
];
export const staff: StaffMember[] = team.map(
  ([name, role, categories, color], i) => ({
    id: name.toLowerCase().replaceAll(" ", "-"),
    name,
    role,
    locationId: i < 7 ? "downtown" : i === 7 ? "westside" : "marina",
    email: `${name.split(" ")[0].toLowerCase()}@salonly.demo`,
    phone: `(212) 555-01${20 + i}`,
    serviceIds: services
      .filter((s) => categories.includes(s.category))
      .map((s) => s.id),
    color,
    commission: 0.4,
    retailCommission: 0.1,
    rating: i % 3 === 0 ? 4.9 : 4.8,
    status: "active",
    hours: 8,
    rebooking: 79 - i * 2,
  }),
);
export const suppliers: Supplier[] = [
  "Salon Supply Co.",
  "Professional Beauty Direct",
  "Pure Ritual Distribution",
  "The Color Collective",
  "Nail Atelier Supply",
  "Botanical Essentials",
  "Studio Tools & Co.",
  "Wellness Trade",
].map((name, i) => ({
  id: `supplier-${i + 1}`,
  name,
  contact: [
    "Alice Monroe",
    "Henry Blake",
    "Grace Lin",
    "Hugo Moreau",
    "Clara Rose",
    "Aria Wells",
    "James Cole",
    "Nina Stone",
  ][i],
  email: `orders@${name.toLowerCase().replace(/[^a-z]/g, "")}.example`,
  phone: `(212) 555-02${10 + i}`,
  brands: [
    "Maison Lune",
    "Atelier Nove",
    "Pure Ritual",
    "Chroma Pro",
    "Polished Co.",
    "Botanical",
    "Studio Essentials",
    "Fern & Field",
  ].slice(i, i + 1),
  status: "active",
}));
const productSeed: [string, string, string, number, number, string][] = [
  ["Bond Repair Shampoo", "Maison Lune", "Shampoo", 32, 18, "cream"],
  ["Nourishing Hair Mask", "Atelier Nove", "Treatment", 48, 26, "peach"],
  ["Gel Polish — Nude 04", "Polished Co.", "Nail Care", 24, 12, "rose"],
  [
    "Bond Repair Conditioner",
    "Maison Lune",
    "Conditioner",
    32,
    18,
    "cream",
  ],
  ["Hydrating Face Serum", "Pure Ritual", "Skin Care", 58, 28, "sage"],
  ["Texture Styling Cream", "Studio Essentials", "Styling", 28, 13, "charcoal"],
  ["Rose Body Oil", "Botanical", "Skin Care", 42, 21, "amber"],
  ["Color Developer 20 Vol", "Chroma Pro", "Color", 22, 11, "cream"],
  ["Scalp Renewal Treatment", "Pure Ritual", "Treatment", 38, 19, "sage"],
  ["Hand & Body Balm", "Fern & Field", "Skin Care", 39, 20, "amber"],
  ["Finishing Spray", "Studio Essentials", "Styling", 26, 12, "charcoal"],
  ["Cuticle Repair Oil", "Polished Co.", "Nail Care", 18, 8, "rose"],
];
export const products: Product[] = Array.from({ length: 60 }, (_, i) => {
  const p = productSeed[i % 12];
  const size = [
    "",
    " · Travel 75 ml",
    " · Salon 500 ml",
    " · Refill 1 L",
    " · Duo Set",
  ][Math.floor(i / 12)];
  return {
    id: `prod-${i + 1}`,
    name: p[0] + size,
    brand: p[1],
    sku: `SL-${String(i + 1).padStart(4, "0")}`,
    category: p[2],
    use: p[2] === "Color" ? "Professional" : i % 4 === 0 ? "Both" : "Retail",
    price: p[3] + Math.floor(i / 12) * 8,
    cost: p[4] + Math.floor(i / 12) * 4,
    reorder: 6,
    supplierId: `supplier-${(i % 8) + 1}`,
    color: p[5],
    status: "active",
  };
});
export const plans: MembershipPlan[] = [
  {
    id: "plan-1",
    name: "Glow Monthly",
    price: 79,
    cycle: "Monthly",
    serviceIds: ["svc-11"],
    benefits: [
      "One signature facial each month",
      "10% off retail essentials",
      "Priority booking access",
    ],
    discount: 10,
    color: "sage",
    status: "active",
  },
  {
    id: "plan-2",
    name: "The Blowout Club",
    price: 129,
    cycle: "Monthly",
    serviceIds: ["svc-2"],
    benefits: [
      "Four blow dries each month",
      "Complimentary conditioning",
      "15% off styling essentials",
    ],
    discount: 15,
    color: "clay",
    status: "active",
  },
  {
    id: "plan-3",
    name: "Barber Society",
    price: 99,
    cycle: "Monthly",
    serviceIds: ["svc-4", "svc-19"],
    benefits: [
      "Four precision haircuts",
      "Two beard trims",
      "Priority evening appointments",
    ],
    discount: 10,
    color: "slate",
    status: "active",
  },
  {
    id: "plan-4",
    name: "Ritual & Restore",
    price: 189,
    cycle: "Monthly",
    serviceIds: ["svc-13", "svc-12"],
    benefits: [
      "One massage and one facial",
      "15% off all retail products",
      "Access across all locations",
    ],
    discount: 15,
    color: "mauve",
    status: "active",
  },
];
export const packages: Package[] = [
  "The Glow Edit",
  "Bridal Morning",
  "Reset & Restore",
  "Color Refresh",
  "Head to Toe",
  "Gentleman’s Ritual",
  "Weekend Escape",
  "The Nail Collection",
].map((name, i) => ({
  id: `pkg-${i + 1}`,
  name,
  serviceIds: [
    ["svc-11", "svc-13", "svc-8"],
    ["svc-31", "svc-32"],
    ["svc-14", "svc-25"],
    ["svc-6", "svc-2"],
    ["svc-3", "svc-9"],
    ["svc-4", "svc-19", "svc-20"],
    ["svc-27", "svc-12"],
    ["svc-8", "svc-9"],
  ][i],
  price: [229, 249, 129, 119, 119, 85, 239, 99][i],
  validity: 90,
  usageLimit: 5,
  locationIds: locations.map((l) => l.id),
  status: "active",
}));
export const resources: Resource[] = Array.from({ length: 12 }, (_, i) => ({
  id: `res-${i + 1}`,
  name:
    i < 4
      ? `Styling Chair ${i + 1}`
      : i < 7
        ? `Treatment Room ${i - 3}`
        : i < 10
          ? `Nail Station ${i - 6}`
          : `Massage Room ${i - 9}`,
  type: i < 4 ? "Chair" : i < 7 ? "Room" : i < 10 ? "Station" : "Room",
  locationId: i < 10 ? "downtown" : "marina",
  serviceIds: services
    .filter((s) =>
      i < 4
        ? ["Hair", "Color", "Barber"].includes(s.category)
        : i < 7
          ? s.category === "Facial"
          : i < 10
            ? s.category === "Nails"
            : s.category === "Massage",
    )
    .map((s) => s.id),
  status: i === 5 ? "maintenance" : "available",
}));
