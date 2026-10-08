/** Where Lite sends people for the full product. Update PRO_URL once your store page is live. */
export const DEMO_URL = "https://salonly-iota.vercel.app";
export const PRO_URL = "https://beaj5.gumroad.com/l/salonly";

export interface ProFeatureInfo {
  title: string;
  description: string;
  highlights: string[];
}

/** Screens that only exist in Salonly Pro, keyed by their first path segment. */
export const proFeatures: Record<string, ProFeatureInfo> = {
  calendar: {
    title: "Staff calendar",
    description:
      "Day, week, month and per-specialist views with duration-sized bookings, breaks, overlap lanes, slot-click booking and a quick-preview drawer.",
    highlights: ["Staff columns", "Click a slot to book", "Mobile agenda view"],
  },
  appointments: {
    title: "Appointment workflow",
    description:
      "Appointment detail with check-in, in-service and checkout steps, plus a six-step booking wizard that catches staff, break, room and time-off conflicts.",
    highlights: [
      "Status workflow",
      "Conflict detection",
      "One-click rebooking",
    ],
  },
  clients: {
    title: "Client profiles",
    description:
      "Everything about a client in one place: preferences, color formulas, visit and purchase timeline, notes, memberships, packages, loyalty and gift cards.",
    highlights: [
      "Color formulas",
      "Visit timeline",
      "Loyalty and store credit",
    ],
  },
  waitlist: {
    title: "Waitlist",
    description:
      "Capture clients who want an earlier slot and book them straight into an opening.",
    highlights: [
      "Preferred specialist and time",
      "Priority",
      "Book from waitlist",
    ],
  },
  memberships: {
    title: "Memberships",
    description:
      "Monthly membership plans with included services, discounts, member lists and recurring revenue.",
    highlights: ["Plan builder", "Member list", "Recurring revenue"],
  },
  loyalty: {
    title: "Loyalty",
    description:
      "Points, tiers and rewards that clients earn at checkout and redeem at the point of sale.",
    highlights: [
      "Bronze to Platinum tiers",
      "Points ledger",
      "Redeem at checkout",
    ],
  },
  staff: {
    title: "Staff profiles",
    description:
      "Team directory and profiles with services offered, schedules, appointments, performance, commissions and time off.",
    highlights: ["Services per specialist", "Performance", "Commission rates"],
  },
  team: {
    title: "Team schedule",
    description:
      "A weekly roster of shifts, breaks and days off for the whole team.",
    highlights: ["Weekly shifts", "Breaks", "Time-off aware"],
  },
  "time-off": {
    title: "Time off",
    description:
      "Time-off requests with approvals that block the calendar automatically.",
    highlights: ["Approve or decline", "Calendar blocking", "Leave types"],
  },
  commissions: {
    title: "Commissions",
    description:
      "Service and retail commissions per team member, calculated from recorded sales with configurable rules.",
    highlights: [
      "Service and retail rates",
      "Commission rules",
      "Statement export",
    ],
  },
  services: {
    title: "Service menu",
    description:
      "Services with variants, add-ons, buffers, cost and margin, available per location and for online booking.",
    highlights: ["Variants and add-ons", "Buffers", "Margin"],
  },
  packages: {
    title: "Packages",
    description:
      "Bundled services sold at the POS and tracked per client until used up.",
    highlights: ["Bundled sessions", "Usage tracking", "Expiry"],
  },
  resources: {
    title: "Rooms & resources",
    description:
      "Chairs, rooms and stations that bookings reserve, with maintenance blocking.",
    highlights: ["Room booking", "Maintenance", "Conflict checks"],
  },
  pos: {
    title: "Point of sale",
    description:
      "Services, retail, packages, memberships and gift cards in one cart, with discounts, tips, tax, loyalty, split payments, receipts and rebooking.",
    highlights: ["Split tender", "Gift cards and store credit", "Stock checks"],
  },
  invoices: {
    title: "Invoices",
    description:
      "Invoice list and print-ready invoices linked to visits, sales and payments.",
    highlights: ["Print view", "Linked records", "Overdue tracking"],
  },
  payments: {
    title: "Payments & refunds",
    description:
      "Every payment by method and status, with refunds that update balances everywhere.",
    highlights: ["Payment methods", "Refunds", "CSV export"],
  },
  "gift-cards": {
    title: "Gift cards",
    description:
      "Sell, track and redeem gift cards with balances and expiry dates.",
    highlights: ["Balances", "Expiry", "Redeem at POS"],
  },
  products: {
    title: "Products",
    description:
      "Retail and professional-use products with pricing, margin, stock and sales history.",
    highlights: ["Retail and back-bar", "Margin", "Stock per location"],
  },
  inventory: {
    title: "Inventory",
    description:
      "Stock across locations, low-stock alerts, adjustments and a full movement history.",
    highlights: ["Multi-location stock", "Adjustments", "Low-stock alerts"],
  },
  suppliers: {
    title: "Suppliers",
    description: "Supplier directory with contacts, brands and open orders.",
    highlights: ["Contacts", "Brands", "Open orders"],
  },
  "purchase-orders": {
    title: "Purchase orders",
    description:
      "Order stock from suppliers and receive it, in full or in part, straight into inventory.",
    highlights: ["Draft to received", "Partial receiving", "Updates stock"],
  },
  reviews: {
    title: "Reviews",
    description: "Client reviews with ratings, replies and review requests.",
    highlights: ["Ratings", "Replies", "Review requests"],
  },
  campaigns: {
    title: "Campaigns",
    description:
      "Reactivation, birthday and membership campaigns aimed at client segments.",
    highlights: ["Segments", "Templates", "Preview"],
  },
  messages: {
    title: "Client inbox",
    description:
      "SMS and email conversations with client context and booking shortcuts.",
    highlights: ["SMS and email", "Client context", "Templates"],
  },
  notifications: {
    title: "Notifications",
    description:
      "Low stock, reviews, reminders and membership events in one feed.",
    highlights: ["Unread filter", "Mark as read", "Linked records"],
  },
  reports: {
    title: "Reports",
    description:
      "Revenue, appointment, service, staff, client, retail and membership reports with charts and CSV export.",
    highlights: ["Seven report areas", "Date and staff filters", "CSV export"],
  },
  documents: {
    title: "Documents",
    description: "Staff, client and supplier documents in one library.",
    highlights: ["Categories", "Owners", "Downloads"],
  },
  settings: {
    title: "Studio settings",
    description:
      "Business, locations, booking rules, cancellations and deposits, payments, taxes, loyalty, notifications, appearance and integrations.",
    highlights: [
      "Booking rules",
      "Taxes and deposits",
      "Light and dark themes",
    ],
  },
};
