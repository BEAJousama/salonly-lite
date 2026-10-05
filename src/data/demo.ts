import type {
  Appointment,
  DemoState,
  Invoice,
  Payment,
  Sale,
  SaleItem,
} from "@/types/domain";
import {
  packages,
  plans,
  products,
  resources,
  services,
  staff,
  suppliers,
} from "./catalog.ts";
import { clients, formulas, notes } from "./clients.ts";
const appointmentSeed: Appointment[] = [
  {
    id: "BK-2026-0218",
    clientId: "emma-walker",
    services: [
      { serviceId: "svc-1", staffId: "mia-carter", price: 220, duration: 120 },
      { serviceId: "svc-2", staffId: "mia-carter", price: 45, duration: 30 },
    ],
    locationId: "downtown",
    date: "2026-10-04",
    time: "10:30",
    status: "confirmed",
    source: "Online",
    notes: "Soft blonde refresh. See saved color formula before mixing.",
    deposit: 0,
    rebooked: false,
    history: [
      {
        id: "event-1",
        text: "Appointment booked online",
        date: "2026-10-01T09:24:00",
      },
      {
        id: "event-2",
        text: "Confirmation sent · demo",
        date: "2026-10-01T09:25:00",
      },
    ],
  },
];
// Past visits are spread across the 28 days leading up to the demo date.
function daysBefore(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}
for (let i = 0; i < 95; i++) {
  const person = staff[(i % 9) + 1];
  const service = services.find(
    (s) =>
      s.id === person.serviceIds[Math.floor(i / 9) % person.serviceIds.length],
  )!;
  const today = i < 27;
  const date = today
    ? "2026-10-04"
    : i < 36
      ? "2026-10-05"
      : daysBefore("2026-10-04", ((i - 36) % 28) + 1);
  appointmentSeed.push({
    id: `BK-2026-${String(219 + i).padStart(4, "0")}`,
    clientId: clients[(i + 1) % 80].id,
    services: [
      {
        serviceId: service.id,
        staffId: person.id,
        price: service.price,
        duration: service.duration,
      },
    ],
    locationId: person.locationId,
    date,
    time: ["09:00", "12:00", "15:00"][Math.floor(i / 9) % 3],
    // At the demo time (10:20 AM) the 9:00 visits are finished or still in the chair.
    status: today
      ? Math.floor(i / 9) % 3 === 0
        ? service.duration > 80
          ? "in-service"
          : i === 1
            ? "checked-in"
            : "completed"
        : "confirmed"
      : i < 36
        ? "confirmed"
        : i % 13 === 0
          ? "cancelled"
          : i % 17 === 0
            ? "no-show"
            : "completed",
    source: i % 2 ? "Online" : "Phone",
    notes: "",
    deposit: 0,
    rebooked: i % 4 !== 0,
    history: [
      { id: `evt-${i}`, text: "Appointment booked", date: `${date}T08:00:00` },
    ],
  });
}
// A completed prior visit links Emma's service and retail history across the application.
appointmentSeed.push({
  id: "BK-2026-0184",
  clientId: "emma-walker",
  services: [
    { serviceId: "svc-1", staffId: "mia-carter", price: 220, duration: 120 },
  ],
  locationId: "downtown",
  date: "2026-09-20",
  time: "10:00",
  status: "completed",
  source: "Staff",
  notes: "Warm finish; color formula saved.",
  deposit: 0,
  rebooked: true,
  history: [],
});
const sales: Sale[] = appointmentSeed
  .filter((a) => a.status === "completed")
  .map((a, i) => {
    const items: SaleItem[] = a.services.map((s) => ({
      id: s.serviceId,
      type: "service",
      name: services.find((v) => v.id === s.serviceId)!.name,
      price: s.price,
      quantity: 1,
      staffId: s.staffId,
    }));
    // Every third visit also takes home a retail product.
    if (i % 3 === 0) {
      const product = products[i % products.length];
      items.push({
        id: product.id,
        type: "product",
        name: product.name,
        price: product.price,
        quantity: 1,
        staffId: a.services[0].staffId,
      });
    }
    const subtotal = items.reduce((s, v) => s + v.price, 0);
    return {
      id: `SALE-${i + 1}`,
      clientId: a.clientId,
      appointmentId: a.id,
      locationId: a.locationId,
      date: `${a.date}T${a.time}:00`,
      items,
      subtotal,
      discount: 0,
      tax: Math.round(subtotal * 6) / 100,
      tip: i % 4 === 0 ? 15 : 0,
      total: Math.round(subtotal * 106) / 100 + (i % 4 === 0 ? 15 : 0),
      note: "",
    };
  });
const invoices: Invoice[] = sales.map((s, i) => ({
  id: `INV-2026-${String(i + 1).padStart(4, "0")}`,
  clientId: s.clientId,
  saleId: s.id,
  appointmentId: s.appointmentId,
  date: s.date.slice(0, 10),
  due: s.date.slice(0, 10),
  total: s.total,
  paid: i % 11 === 0 ? 0 : s.total,
  status: i % 11 === 0 ? "overdue" : "paid",
}));
const payments: Payment[] = invoices
  .filter((i) => i.paid > 0)
  .map((v, i) => ({
    id: `PAY-2026-${String(i + 1).padStart(4, "0")}`,
    clientId: v.clientId,
    invoiceId: v.id,
    method: i % 4 === 0 ? "Cash" : "Card",
    date: v.date,
    amount: v.paid,
    status: "completed",
  }));
export function createDemoState(): DemoState {
  return structuredClone({
    clients,
    staff,
    services,
    products,
    suppliers,
    plans,
    packages,
    resources,
    notes,
    formulas,
    appointments: appointmentSeed,
    sales,
    invoices,
    payments,
    refunds: [],
    clientPackages: [
      {
        id: "client-pkg-1",
        clientId: "emma-walker",
        packageId: "pkg-1",
        remaining: 3,
        expires: "2026-12-31",
      },
    ],
    inventory: products.flatMap((p, i) =>
      ["downtown", "westside", "marina"].map((locationId, j) => ({
        id: `stock-${i}-${j}`,
        productId: p.id,
        locationId,
        onHand: i < 3 ? 3 - i : i % 17 === 0 ? 0 : 8 + ((i * 7 + j * 3) % 32),
        reserved: 0,
      })),
    ),
    movements: products.slice(0, 15).map((p, i) => ({
      id: `move-${i}`,
      productId: p.id,
      locationId: "downtown",
      type: "Purchase",
      quantity: 12,
      reason: "Opening stock received from supplier",
      date: "2026-09-28T10:00:00",
    })),
    memberships: clients
      .filter((c, i) => i % 3 === 0 || c.id === "emma-walker")
      .map((c, i) => ({
        id: `mem-${i}`,
        clientId: c.id,
        planId: plans[i % 4].id,
        status: "active",
        joined: "2026-03-04",
        renewal: "2026-11-04",
        remaining: 1,
      })),
    loyalty: clients.map((c, i) => ({
      id: `loyalty-${i}`,
      clientId: c.id,
      points: i === 0 ? 1840 : 150 + i * 45,
      tier:
        i === 0
          ? "Gold"
          : i % 4 === 0
            ? "Platinum"
            : i % 3 === 0
              ? "Gold"
              : i % 2 === 0
                ? "Silver"
                : "Bronze",
    })),
    loyaltyTransactions: [],
    giftCards: Array.from({ length: 24 }, (_, i) => ({
      id: `GC-${3812 + i}`,
      clientId: clients[i].id,
      recipient: clients[(i + 10) % 80].name,
      email: clients[(i + 10) % 80].email,
      message: "A little time just for you.",
      value: i % 2 ? 100 : 150,
      balance: i % 5 === 0 ? 0 : i % 2 ? 100 : 75,
      issued: "2026-09-20",
      expires: "2027-09-20",
      status: i % 5 === 0 ? "used" : "active",
    })),
    purchaseOrders: Array.from({ length: 12 }, (_, i) => ({
      id: `PO-2026-${String(42 + i).padStart(4, "0")}`,
      supplierId: suppliers[i % 8].id,
      locationId: "downtown",
      date: "2026-10-01",
      expected: "2026-10-08",
      items: products
        .filter((p) => p.supplierId === suppliers[i % 8].id)
        .slice(0, 3)
        .map((p) => ({
          productId: p.id,
          quantity: 12,
          received: i > 7 ? 12 : 0,
          cost: p.cost,
        })),
      status: i > 7 ? "received" : i % 4 === 0 ? "draft" : "ordered",
    })),
    schedules: staff.flatMap((s) =>
      Array.from({ length: 7 }, (_, day) => ({
        id: `schedule-${s.id}-${day}`,
        staffId: s.id,
        day,
        start: "09:00",
        end: "18:00",
        breakStart: "13:00",
        breakEnd: "14:00",
        off: day === 2,
      })),
    ),
    timeOff: staff.slice(0, 6).map((s, i) => ({
      id: `leave-${i}`,
      staffId: s.id,
      type: i % 2 ? "Training" : "Vacation",
      start: `2026-10-${15 + i}`,
      end: `2026-10-${17 + i}`,
      reason: i % 2 ? "Advanced technique workshop" : "Planned annual leave",
      status: i > 2 ? "approved" : "pending",
    })),
    reviews: Array.from({ length: 36 }, (_, i) => ({
      id: `review-${i}`,
      clientId: clients[i].id,
      staffId: staff[i % 10].id,
      serviceId: staff[i % 10].serviceIds[0],
      rating: i % 7 === 0 ? 4 : 5,
      comment: [
        "Such a thoughtful consultation. I left feeling like myself, only better.",
        "A lovely, calm studio and a beautiful result. Already booked my next visit.",
        "The attention to detail makes every appointment feel special.",
        "Professional, warm, and always on time. My favorite part of the month.",
      ][i % 4],
      date: `2026-10-${String((i % 4) + 1).padStart(2, "0")}`,
      response:
        i % 3 === 0
          ? "Thank you for trusting our team. We look forward to your next visit!"
          : "",
    })),
    campaigns: [
      {
        id: "campaign-1",
        name: "We miss you",
        type: "Reactivation",
        audience: "Inactive 90 days",
        recipients: 18,
        offer: "20% off your next booking",
        status: "draft",
        date: "2026-10-08",
      },
      {
        id: "campaign-2",
        name: "An October birthday treat",
        type: "Birthday",
        audience: "Birthday this month",
        recipients: 7,
        offer: "A complimentary conditioning treatment",
        status: "scheduled",
        date: "2026-10-10",
      },
      {
        id: "campaign-3",
        name: "Your autumn ritual",
        type: "Email",
        audience: "Membership",
        recipients: 27,
        offer: "Discover our seasonal treatment menu",
        status: "sent",
        date: "2026-10-01",
      },
    ],
    threads: clients.slice(0, 18).map((c, i) => ({
      id: `thread-${i}`,
      clientId: c.id,
      channel: i % 3 === 0 ? "Email" : "SMS",
      unread: i < 3,
      messages: [
        {
          id: `msg-${i}-1`,
          text:
            i === 0
              ? "Hi Emma, just confirming your appointment on October 4 at 10:30 AM with Mia. We look forward to seeing you."
              : "Hi! Your next visit is confirmed. Let us know if you have any questions.",
          incoming: false,
          date: "2026-10-03T14:20:00",
        },
        {
          id: `msg-${i}-2`,
          text:
            i === 0
              ? "Perfect, thank you! Looking forward to my color refresh."
              : "Thank you, see you soon!",
          incoming: true,
          date: "2026-10-03T14:25:00",
        },
      ],
    })),
    notifications: Array.from({ length: 18 }, (_, i) => ({
      id: `notification-${i}`,
      title: [
        "Low stock alert",
        "A little love from your clients",
        "Appointment reminder",
        "Membership renewed",
      ][i % 4],
      text: [
        "Bond Repair Shampoo has reached its reorder level.",
        "Emma Walker left a 5-star review.",
        "Your next appointment starts at 10:30 AM.",
        "Glow Monthly renewed successfully.",
      ][i % 4],
      date: `2026-10-04T${String(9 + (i % 3)).padStart(2, "0")}:20:00`,
      read: i > 4,
      href: ["/inventory", "/reviews", "/calendar", "/memberships"][i % 4],
    })),
    documents: [
      {
        id: "doc-1",
        name: "Studio service guidelines",
        category: "Staff Documents",
        owner: "Mia Carter",
        date: "2026-09-20",
        size: "2 KB",
        content:
          "Salonly Studio — Service Guidelines\n\nBegin every appointment with a consultation. Review preferences and sensitivities. Record formulas after color services. Offer a rebooking recommendation at checkout.",
      },
      {
        id: "doc-2",
        name: "Emma — consultation preferences",
        category: "Client Documents",
        owner: "Emma Walker",
        date: "2026-09-20",
        size: "1 KB",
        content:
          "Emma Walker\nPreferred colorist: Mia Carter\nPreferences: Soft blonde, gentle scalp products, morning appointments.",
      },
      {
        id: "doc-3",
        name: "Supplier receiving checklist",
        category: "Supplier Files",
        owner: "Salon Supply Co.",
        date: "2026-10-01",
        size: "1 KB",
        content:
          "Count received quantities. Check packaging and expiry dates. Record damaged items separately. Confirm stock location before receiving.",
      },
    ],
    waitlist: clients.slice(10, 18).map((c, i) => ({
      id: `wait-${i}`,
      clientId: c.id,
      serviceId: staff[i].serviceIds[0],
      staffId: staff[i].id,
      from: "2026-10-04",
      to: "2026-10-11",
      preference: i % 2 ? "Afternoon" : "Morning",
      priority: i < 2 ? "High" : "Normal",
      status: "waiting",
    })),
    activity: [
      {
        id: "act-1",
        text: "Sofia Garcia checked in for her facial.",
        date: "2026-10-04T11:42:00",
      },
      {
        id: "act-2",
        text: "Ava completed a gel manicure.",
        date: "2026-10-04T11:36:00",
      },
      {
        id: "act-3",
        text: "Gift card GC-3813 is ready for its recipient.",
        date: "2026-10-04T11:27:00",
      },
      {
        id: "act-4",
        text: "A new membership joined Glow Monthly.",
        date: "2026-10-04T10:58:00",
      },
    ],
    settings: {
      businessName: "Salonly Studio",
      phone: "(212) 555-0100",
      email: "hello@salonly.demo",
      website: "salonly.demo",
      currency: "USD",
      timezone: "America/New_York",
      address: "128 Spring Street, New York, NY",
      taxId: "DEMO-2026",
      serviceTax: "6",
      productTax: "6",
      increments: "15",
      minimumNotice: "2",
      maxAdvance: "90",
      cancellation: "24",
      onlineBooking: true,
      deposits: false,
      automaticConfirmation: true,
      waitlist: true,
      pointsPerDollar: "1",
      rewardPoints: "500",
      rewardValue: "10",
      birthdayBonus: true,
      referralBonus: true,
      emailNotifications: true,
      smsNotifications: false,
      weeklyReport: true,
      studioNote:
        "Bookings, clients, staff and revenue — beautifully organized.",
    },
    user: {
      id: "user-1",
      name: "Mia Carter",
      email: "admin@salonly.demo",
      phone: "(212) 555-0120",
      role: "Owner",
      locationId: "downtown",
      timezone: "America/New_York",
      language: "English",
    },
  });
}
