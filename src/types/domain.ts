export type Id = string;
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "checked-in"
  | "in-service"
  | "completed"
  | "cancelled"
  | "no-show";
export type PaymentStatus =
  "pending" | "completed" | "partially-refunded" | "refunded" | "failed";
export type MembershipStatus =
  "active" | "past-due" | "paused" | "cancelled" | "expired";
export type InventoryStatus =
  "in-stock" | "low-stock" | "out-of-stock" | "on-order";
export type ClientTag =
  | "VIP"
  | "New Client"
  | "Blonde"
  | "Sensitive Skin"
  | "Bridal"
  | "Membership"
  | "Corporate";
export interface Location {
  id: Id;
  name: string;
  address: string;
  phone: string;
}
export interface ClientNote {
  id: Id;
  clientId: Id;
  kind: "General" | "Service" | "Internal";
  text: string;
  staffId: Id;
  date: string;
}
export interface ClientFormula {
  id: Id;
  clientId: Id;
  staffId: Id;
  date: string;
  root: string;
  lengths: string;
  developer: string;
  processing: number;
}
export interface Client {
  id: Id;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  joined: string;
  locationId: Id;
  staffId: Id;
  tags: ClientTag[];
  visits: number;
  openingSpend: number;
  lastVisit: string;
  preferences: string;
  sensitivities: string;
  communication: "Email" | "SMS";
  credit: number;
  noShows: number;
  referrals: number;
  status: "active" | "inactive";
}
export interface AppointmentService {
  serviceId: Id;
  staffId: Id;
  price: number;
  duration: number;
}
export interface ActivityEvent {
  id: Id;
  text: string;
  date: string;
  appointmentId?: Id;
}
export interface Appointment {
  id: Id;
  clientId: Id;
  services: AppointmentService[];
  locationId: Id;
  date: string;
  time: string;
  status: AppointmentStatus;
  source:
    "Online" | "Phone" | "Walk In" | "Instagram" | "Google" | "Staff" | "Other";
  notes: string;
  deposit: number;
  resourceId?: Id;
  rebooked: boolean;
  history: ActivityEvent[];
}
export interface StaffMember {
  id: Id;
  name: string;
  role: string;
  locationId: Id;
  email: string;
  phone: string;
  serviceIds: Id[];
  color: string;
  commission: number;
  retailCommission: number;
  rating: number;
  status: "active" | "off";
  hours: number;
  rebooking: number;
}
export interface StaffSchedule {
  id: Id;
  staffId: Id;
  day: number;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
  off: boolean;
}
export interface TimeOffRequest {
  id: Id;
  staffId: Id;
  type: "Vacation" | "Sick" | "Personal" | "Training" | "Other";
  start: string;
  end: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}
export interface ServiceVariant {
  name: string;
  price: number;
  duration: number;
}
export interface ServiceAddon {
  id: Id;
  name: string;
  price: number;
  duration: number;
}
export interface Service {
  id: Id;
  name: string;
  category: string;
  duration: number;
  price: number;
  cost: number;
  tax: number;
  buffer: number;
  online: boolean;
  locationIds: Id[];
  variants: ServiceVariant[];
  addons: ServiceAddon[];
}
export interface Package {
  id: Id;
  name: string;
  serviceIds: Id[];
  price: number;
  validity: number;
  usageLimit: number;
  locationIds: Id[];
  status: string;
}
export interface MembershipPlan {
  id: Id;
  name: string;
  price: number;
  cycle: "Monthly" | "Annual";
  serviceIds: Id[];
  benefits: string[];
  discount: number;
  color: string;
  status: "active" | "paused";
}
export interface ClientMembership {
  id: Id;
  clientId: Id;
  planId: Id;
  status: MembershipStatus;
  joined: string;
  renewal: string;
  remaining: number;
}
export interface ClientPackage {
  id: Id;
  clientId: Id;
  packageId: Id;
  remaining: number;
  expires: string;
}
export interface LoyaltyAccount {
  id: Id;
  clientId: Id;
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}
export interface LoyaltyTransaction {
  id: Id;
  clientId: Id;
  points: number;
  reason: string;
  date: string;
}
export interface Resource {
  id: Id;
  name: string;
  type: "Chair" | "Room" | "Station" | "Bed";
  locationId: Id;
  serviceIds: Id[];
  status: "available" | "occupied" | "maintenance";
}
export type Room = Resource & { type: "Room" };
export interface Product {
  id: Id;
  name: string;
  brand: string;
  sku: string;
  category: string;
  use: "Retail" | "Professional" | "Both";
  price: number;
  cost: number;
  reorder: number;
  supplierId: Id;
  color: string;
  status: "active" | "archived";
}
export interface InventoryLevel {
  id: Id;
  productId: Id;
  locationId: Id;
  onHand: number;
  reserved: number;
}
export interface StockMovement {
  id: Id;
  productId: Id;
  locationId: Id;
  type:
    | "Purchase"
    | "Sale"
    | "Adjustment"
    | "Professional Use"
    | "Waste"
    | "Damage"
    | "Transfer"
    | "Return";
  quantity: number;
  reason: string;
  date: string;
}
export interface Supplier {
  id: Id;
  name: string;
  contact: string;
  email: string;
  phone: string;
  brands: string[];
  status: "active" | "inactive";
}
export interface PurchaseOrder {
  id: Id;
  supplierId: Id;
  locationId: Id;
  date: string;
  expected: string;
  items: { productId: Id; quantity: number; received: number; cost: number }[];
  status: "draft" | "ordered" | "partially-received" | "received" | "cancelled";
}
export interface GiftCard {
  id: Id;
  clientId: Id;
  recipient: string;
  email: string;
  message: string;
  value: number;
  balance: number;
  issued: string;
  expires: string;
  status: "active" | "used" | "expired" | "disabled";
}
export interface SaleItem {
  id: Id;
  type: "service" | "product" | "package" | "membership" | "gift-card";
  name: string;
  price: number;
  quantity: number;
  staffId?: Id;
}
export interface Sale {
  id: Id;
  clientId: Id;
  appointmentId?: Id;
  locationId: Id;
  date: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  tip: number;
  total: number;
  note: string;
}
export interface Invoice {
  id: Id;
  clientId: Id;
  saleId: Id;
  appointmentId?: Id;
  date: string;
  due: string;
  total: number;
  paid: number;
  status:
    | "draft"
    | "sent"
    | "partially-paid"
    | "paid"
    | "overdue"
    | "void"
    | "refunded";
}
export interface Payment {
  id: Id;
  clientId: Id;
  invoiceId: Id;
  method:
    "Card" | "Cash" | "Bank Transfer" | "Gift Card" | "Store Credit" | "Other";
  date: string;
  amount: number;
  status: PaymentStatus;
}
export interface Refund {
  id: Id;
  paymentId: Id;
  amount: number;
  reason: string;
  date: string;
}
export interface Commission {
  id: Id;
  staffId: Id;
  serviceRevenue: number;
  retailRevenue: number;
  serviceCommission: number;
  retailCommission: number;
  status: "pending" | "paid";
}
export interface Review {
  id: Id;
  clientId: Id;
  staffId: Id;
  serviceId: Id;
  rating: number;
  comment: string;
  date: string;
  response: string;
}
export interface Campaign {
  id: Id;
  name: string;
  type: "Email" | "SMS" | "Offer" | "Birthday" | "Reactivation";
  audience: string;
  recipients: number;
  offer: string;
  status: "draft" | "scheduled" | "sent";
  date: string;
}
export interface Message {
  id: Id;
  text: string;
  incoming: boolean;
  date: string;
}
export interface MessageThread {
  id: Id;
  clientId: Id;
  channel: "SMS" | "Email" | "Internal";
  messages: Message[];
  unread: boolean;
}
export interface Notification {
  id: Id;
  title: string;
  text: string;
  date: string;
  read: boolean;
  href: string;
}
export interface User {
  id: Id;
  name: string;
  email: string;
  phone: string;
  role: string;
  locationId: Id;
  timezone: string;
  language: string;
}
export interface Document {
  id: Id;
  name: string;
  category: string;
  owner: string;
  date: string;
  size: string;
  content: string;
}
export interface WaitlistEntry {
  id: Id;
  clientId: Id;
  serviceId: Id;
  staffId: Id;
  from: string;
  to: string;
  preference: string;
  priority: "Normal" | "High";
  status: "waiting" | "matched" | "contacted" | "booked" | "expired";
}
export interface DemoState {
  clients: Client[];
  appointments: Appointment[];
  staff: StaffMember[];
  services: Service[];
  products: Product[];
  inventory: InventoryLevel[];
  movements: StockMovement[];
  sales: Sale[];
  invoices: Invoice[];
  payments: Payment[];
  refunds: Refund[];
  notes: ClientNote[];
  formulas: ClientFormula[];
  memberships: ClientMembership[];
  clientPackages: ClientPackage[];
  plans: MembershipPlan[];
  packages: Package[];
  loyalty: LoyaltyAccount[];
  loyaltyTransactions: LoyaltyTransaction[];
  giftCards: GiftCard[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  resources: Resource[];
  schedules: StaffSchedule[];
  timeOff: TimeOffRequest[];
  reviews: Review[];
  campaigns: Campaign[];
  threads: MessageThread[];
  notifications: Notification[];
  documents: Document[];
  waitlist: WaitlistEntry[];
  activity: ActivityEvent[];
  settings: Record<string, string | boolean>;
  user: User;
}
