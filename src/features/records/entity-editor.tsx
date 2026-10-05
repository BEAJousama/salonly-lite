"use client";
import { Button, Field, Modal } from "@/components/ui/primitives";
import { locations } from "@/data/catalog";
import { useStudio } from "@/hooks/use-studio";
import { DEMO_DATE, uid } from "@/lib/format";
import type {
  Campaign,
  ClientNote,
  ClientTag,
  DemoState,
  Product,
  StockMovement,
  TimeOffRequest,
} from "@/types/domain";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
export type EditorKind =
  | "client"
  | "staff"
  | "service"
  | "product"
  | "package"
  | "gift-card"
  | "supplier"
  | "purchase-order"
  | "campaign"
  | "time-off"
  | "waitlist"
  | "stock"
  | "note"
  | "formula"
  | "membership"
  | "schedule";
interface FormField {
  key: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "number"
    | "date"
    | "time"
    | "textarea"
    | "select"
    | "multi";
  options?: { value: string; label: string }[];
  required?: boolean;
  min?: number;
  max?: number;
  initial?: string;
  hint?: string;
}
export function EntityEditor({
  kind,
  id,
  contextId,
  open,
  onClose,
}: {
  kind: EditorKind;
  id?: string;
  contextId?: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${id ? "Edit" : "New"} ${kind.replaceAll("-", " ")}`}
      description="Keep the details that make your studio run smoothly."
      wide
    >
      <EditorFields
        key={`${kind}-${id}-${contextId}`}
        kind={kind}
        id={id}
        contextId={contextId}
        onClose={onClose}
      />
    </Modal>
  );
}
function EditorFields({
  kind,
  id,
  contextId,
  onClose,
}: {
  kind: EditorKind;
  id?: string;
  contextId?: string;
  onClose: () => void;
}) {
  const { state, location, update } = useStudio();
  const options = (values: string[]) =>
    values.map((value) => ({ value, label: value }));
  const people = state.clients.map((c) => ({ value: c.id, label: c.name })),
    team = state.staff.map((s) => ({ value: s.id, label: s.name })),
    serviceOptions = state.services.map((s) => ({
      value: s.id,
      label: s.name,
    })),
    locationOptions = locations.map((l) => ({ value: l.id, label: l.name }));
  const currentLocation = location === "all" ? "downtown" : location;
  let fields: FormField[] = [];
  let source: Record<string, unknown> = {};
  const name: FormField = { key: "name", label: "Name", required: true };
  const email: FormField = {
    key: "email",
    label: "Email",
    type: "email",
    required: true,
  };
  const locationField: FormField = {
    key: "locationId",
    label: "Location",
    type: "select",
    options: locationOptions,
    initial: currentLocation,
  };
  const price: FormField = {
    key: "price",
    label: "Price",
    type: "number",
    min: 0,
    required: true,
  };
  switch (kind) {
    case "client":
      source = { ...state.clients.find((c) => c.id === id) };
      fields = [
        name,
        email,
        { key: "phone", label: "Phone", required: true },
        { key: "birthday", label: "Birthday", type: "date" },
        locationField,
        {
          key: "staffId",
          label: "Preferred specialist",
          type: "select",
          options: team,
        },
        { key: "preferences", label: "Preferences", type: "textarea" },
        { key: "sensitivities", label: "Sensitivities", type: "textarea" },
        {
          key: "tags",
          label: "Client tags",
          type: "multi",
          options: options([
            "VIP",
            "New Client",
            "Blonde",
            "Sensitive Skin",
            "Bridal",
            "Membership",
            "Corporate",
          ]),
        },
      ];
      break;
    case "staff":
      source = { ...state.staff.find((s) => s.id === id) };
      fields = [
        name,
        email,
        { key: "phone", label: "Phone", required: true },
        {
          key: "role",
          label: "Role",
          type: "select",
          options: options([
            "Stylist",
            "Senior Colorist",
            "Barber",
            "Nail Technician",
            "Massage Therapist",
            "Esthetician",
            "Makeup Artist",
            "Receptionist",
            "Manager",
            "Owner",
          ]),
        },
        locationField,
        {
          key: "serviceIds",
          label: "Services offered",
          type: "multi",
          options: serviceOptions,
        },
        {
          key: "commission",
          label: "Service commission (%)",
          type: "number",
          min: 0,
          max: 100,
          initial: "40",
        },
      ];
      if (source.commission)
        source.commission = Number(source.commission) * 100;
      break;
    case "service":
      source = { ...state.services.find((s) => s.id === id) };
      fields = [
        name,
        {
          key: "category",
          label: "Category",
          type: "select",
          options: options([
            "Hair",
            "Color",
            "Nails",
            "Facial",
            "Massage",
            "Brows",
            "Lashes",
            "Makeup",
            "Barber",
            "Waxing",
            "Wellness",
          ]),
        },
        price,
        {
          key: "duration",
          label: "Duration (minutes)",
          type: "number",
          min: 5,
          max: 480,
          required: true,
        },
        {
          key: "cost",
          label: "Product cost",
          type: "number",
          min: 0,
          initial: "0",
        },
        {
          key: "buffer",
          label: "Cleanup buffer (minutes)",
          type: "number",
          min: 0,
          initial: "0",
        },
      ];
      break;
    case "product":
      source = { ...state.products.find((p) => p.id === id) };
      fields = [
        name,
        { key: "brand", label: "Brand", required: true },
        { key: "sku", label: "SKU", required: true },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: options([
            "Shampoo",
            "Conditioner",
            "Treatment",
            "Color",
            "Styling",
            "Skin Care",
            "Nail Care",
            "Tools",
            "Accessories",
          ]),
        },
        price,
        { key: "cost", label: "Cost", type: "number", min: 0, required: true },
        {
          key: "reorder",
          label: "Reorder level",
          type: "number",
          min: 0,
          initial: "6",
        },
        {
          key: "use",
          label: "Product use",
          type: "select",
          options: options(["Retail", "Professional", "Both"]),
        },
        {
          key: "supplierId",
          label: "Supplier",
          type: "select",
          options: state.suppliers.map((s) => ({ value: s.id, label: s.name })),
        },
      ];
      break;
    case "package":
      source = { ...state.packages.find((p) => p.id === id) };
      fields = [
        name,
        price,
        {
          key: "serviceIds",
          label: "Included services",
          type: "multi",
          options: serviceOptions,
          required: true,
        },
        {
          key: "validity",
          label: "Valid for (days)",
          type: "number",
          min: 1,
          initial: "90",
        },
        {
          key: "usageLimit",
          label: "Usage limit",
          type: "number",
          min: 1,
          initial: "5",
        },
      ];
      break;
    case "gift-card":
      fields = [
        {
          key: "clientId",
          label: "Purchaser",
          type: "select",
          options: people,
        },
        { key: "recipient", label: "Recipient name", required: true },
        email,
        {
          key: "value",
          label: "Gift card amount",
          type: "number",
          min: 1,
          max: 5000,
          required: true,
          initial: "100",
        },
        { key: "message", label: "Personal message", type: "textarea" },
        {
          key: "expires",
          label: "Expires",
          type: "date",
          initial: "2027-10-04",
          required: true,
        },
      ];
      break;
    case "supplier":
      source = { ...state.suppliers.find((s) => s.id === id) };
      fields = [
        name,
        { key: "contact", label: "Contact name", required: true },
        email,
        { key: "phone", label: "Phone", required: true },
        { key: "brands", label: "Brands (comma separated)", required: true },
      ];
      break;
    case "purchase-order":
      fields = [
        {
          key: "supplierId",
          label: "Supplier",
          type: "select",
          options: state.suppliers.map((s) => ({ value: s.id, label: s.name })),
        },
        locationField,
        {
          key: "productId",
          label: "Product",
          type: "select",
          options: state.products.map((p) => ({
            value: p.id,
            label: `${p.brand} · ${p.name}`,
          })),
        },
        {
          key: "quantity",
          label: "Quantity",
          type: "number",
          min: 1,
          required: true,
          initial: "12",
        },
        {
          key: "expected",
          label: "Expected delivery",
          type: "date",
          initial: "2026-10-11",
          required: true,
        },
      ];
      break;
    case "campaign":
      fields = [
        name,
        {
          key: "type",
          label: "Campaign type",
          type: "select",
          options: options([
            "Email",
            "SMS",
            "Offer",
            "Birthday",
            "Reactivation",
          ]),
        },
        {
          key: "audience",
          label: "Audience",
          type: "select",
          options: options([
            "VIP",
            "New Clients",
            "Inactive 60 Days",
            "Inactive 90 Days",
            "Birthday This Month",
            "High Spend",
            "No Upcoming Appointment",
            "Membership",
            "Retail Buyers",
          ]),
        },
        {
          key: "offer",
          label: "Message / offer",
          type: "textarea",
          required: true,
        },
        {
          key: "date",
          label: "Scheduled date",
          type: "date",
          initial: "2026-10-11",
        },
      ];
      break;
    case "time-off":
      fields = [
        {
          key: "staffId",
          label: "Staff member",
          type: "select",
          options: team,
        },
        {
          key: "type",
          label: "Type",
          type: "select",
          options: options([
            "Vacation",
            "Sick",
            "Personal",
            "Training",
            "Other",
          ]),
        },
        {
          key: "start",
          label: "Start date",
          type: "date",
          required: true,
          initial: DEMO_DATE,
        },
        {
          key: "end",
          label: "End date",
          type: "date",
          required: true,
          initial: DEMO_DATE,
        },
        { key: "reason", label: "Reason", type: "textarea", required: true },
      ];
      break;
    case "waitlist":
      fields = [
        { key: "clientId", label: "Client", type: "select", options: people },
        {
          key: "serviceId",
          label: "Service",
          type: "select",
          options: serviceOptions,
        },
        {
          key: "staffId",
          label: "Preferred specialist",
          type: "select",
          options: team,
        },
        {
          key: "from",
          label: "From",
          type: "date",
          initial: DEMO_DATE,
          required: true,
        },
        {
          key: "to",
          label: "Until",
          type: "date",
          initial: "2026-10-11",
          required: true,
        },
        {
          key: "preference",
          label: "Time preference",
          type: "select",
          options: options(["Morning", "Afternoon", "Any time"]),
        },
        {
          key: "priority",
          label: "Priority",
          type: "select",
          options: options(["Normal", "High"]),
        },
      ];
      break;
    case "stock":
      fields = [
        {
          key: "productId",
          label: "Product",
          type: "select",
          options: state.products.map((p) => ({ value: p.id, label: p.name })),
          initial: contextId,
        },
        locationField,
        {
          key: "type",
          label: "Movement type",
          type: "select",
          options: options([
            "Adjustment",
            "Purchase",
            "Professional Use",
            "Waste",
            "Damage",
            "Return",
          ]),
        },
        {
          key: "quantity",
          label: "Quantity change",
          type: "number",
          required: true,
          hint: "Positive adds stock. Negative removes stock.",
        },
        { key: "reason", label: "Reason", type: "textarea", required: true },
      ];
      break;
    case "note":
      fields = [
        {
          key: "kind",
          label: "Note type",
          type: "select",
          options: options(["General", "Service", "Internal"]),
        },
        { key: "text", label: "Note", type: "textarea", required: true },
      ];
      break;
    case "formula":
      fields = [
        { key: "root", label: "Root formula", required: true },
        { key: "lengths", label: "Lengths / gloss", required: true },
        { key: "developer", label: "Developer", required: true },
        {
          key: "processing",
          label: "Processing (minutes)",
          type: "number",
          min: 1,
          max: 180,
          required: true,
        },
      ];
      break;
    case "membership":
      fields = [
        {
          key: "clientId",
          label: "Client",
          type: "select",
          options: people,
          initial: contextId,
        },
        {
          key: "planId",
          label: "Membership plan",
          type: "select",
          options: state.plans.map((p) => ({ value: p.id, label: p.name })),
        },
        {
          key: "renewal",
          label: "Next renewal",
          type: "date",
          required: true,
          initial: "2026-11-04",
        },
      ];
      break;
    case "schedule":
      source = { ...state.schedules.find((s) => s.id === id) };
      fields = [
        { key: "start", label: "Shift start", type: "time", required: true },
        { key: "end", label: "Shift end", type: "time", required: true },
        {
          key: "breakStart",
          label: "Break start",
          type: "time",
          required: true,
        },
        { key: "breakEnd", label: "Break end", type: "time", required: true },
        {
          key: "off",
          label: "Working status",
          type: "select",
          options: [
            { value: "false", label: "Working" },
            { value: "true", label: "Day off" },
          ],
        },
      ];
      break;
  }
  const defaults = Object.fromEntries(
    fields.map((f) => [
      f.key,
      source[f.key] !== undefined
        ? Array.isArray(source[f.key])
          ? (source[f.key] as string[]).join(",")
          : String(source[f.key])
        : (f.initial ?? f.options?.[0]?.value ?? ""),
    ]),
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Record<string, string>>({ defaultValues: defaults });
  const formValues=useWatch({control});
  function submit(v: Record<string, string>) {
    let invalid = false;
    for (const field of fields) {
      let check: z.ZodType = z.string();
      if (field.type === "email")
        check = z.email("Enter a valid email address.");
      else if (field.type === "number")
        check = z.coerce
          .number()
          .min(field.min ?? -99999)
          .max(field.max ?? 999999);
      else if (field.required)
        check = z.string().trim().min(1, `${field.label} is required.`);
      if (field.type === "date" && field.required)
        check = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date.");
      const result = check.safeParse(v[field.key]);
      if (!result.success) {
        setError(field.key, { message: result.error.issues[0].message });
        invalid = true;
      }
    }
    if (invalid) return;
    const newId = id ?? uid(kind),
      num = (key: string) => Number(v[key]),
      list = (key: string) => (v[key] ?? "").split(",").filter(Boolean),
      now = new Date().toISOString();
    const ok = update(
      (s) => {
        const next: DemoState = structuredClone(s);
        switch (kind) {
          case "client": {
            const old = next.clients.find((c) => c.id === id);
            const record = {
              id: newId,
              name: v.name,
              email: v.email,
              phone: v.phone,
              birthday: v.birthday,
              joined: old?.joined ?? DEMO_DATE,
              locationId: v.locationId,
              staffId: v.staffId,
              tags: list("tags") as ClientTag[],
              visits: old?.visits ?? 0,
              openingSpend: old?.openingSpend ?? 0,
              lastVisit: old?.lastVisit ?? "",
              preferences: v.preferences,
              sensitivities: v.sensitivities || "None noted",
              communication: old?.communication ?? ("Email" as const),
              credit: old?.credit ?? 0,
              noShows: old?.noShows ?? 0,
              referrals: old?.referrals ?? 0,
              status: old?.status ?? ("active" as const),
            };
            next.clients = id
              ? next.clients.map((c) => (c.id === id ? record : c))
              : [record, ...next.clients];
            if (!id)
              next.loyalty.push({
                id: uid("loyalty"),
                clientId: newId,
                points: 0,
                tier: "Bronze",
              });
            break;
          }
          case "staff": {
            const old = next.staff.find((s) => s.id === id);
            const record = {
              id: newId,
              name: v.name,
              email: v.email,
              phone: v.phone,
              role: v.role,
              locationId: v.locationId,
              serviceIds: list("serviceIds"),
              color: old?.color ?? "sage",
              commission: num("commission") / 100,
              retailCommission: 0.1,
              rating: old?.rating ?? 0,
              status: "active" as const,
              hours: 8,
              rebooking: old?.rebooking ?? 0,
            };
            next.staff = id
              ? next.staff.map((s) => (s.id === id ? record : s))
              : [...next.staff, record];
            break;
          }
          case "service": {
            const old = next.services.find((s) => s.id === id);
            const record = {
              id: newId,
              name: v.name,
              category: v.category,
              price: num("price"),
              duration: num("duration"),
              cost: num("cost"),
              tax: 0.06,
              buffer: num("buffer"),
              online: old?.online ?? true,
              locationIds: old?.locationIds ?? locations.map((l) => l.id),
              variants: old?.variants ?? [],
              addons: old?.addons ?? [],
            };
            next.services = id
              ? next.services.map((s) => (s.id === id ? record : s))
              : [record, ...next.services];
            break;
          }
          case "product": {
            if (next.products.some((p) => p.sku === v.sku && p.id !== id))
              throw new Error("This SKU is already in use.");
            const record: Product = {
              id: newId,
              name: v.name,
              brand: v.brand,
              sku: v.sku,
              category: v.category,
              use: v.use as Product["use"],
              price: num("price"),
              cost: num("cost"),
              reorder: num("reorder"),
              supplierId: v.supplierId,
              color: "cream",
              status: "active",
            };
            next.products = id
              ? next.products.map((p) => (p.id === id ? record : p))
              : [record, ...next.products];
            if (!id)
              next.inventory.push({
                id: uid("stock"),
                productId: newId,
                locationId: currentLocation,
                onHand: 0,
                reserved: 0,
              });
            break;
          }
          case "package": {
            const record = {
              id: newId,
              name: v.name,
              price: num("price"),
              serviceIds: list("serviceIds"),
              validity: num("validity"),
              usageLimit: num("usageLimit"),
              locationIds: locations.map((l) => l.id),
              status: "active",
            };
            next.packages = id
              ? next.packages.map((p) => (p.id === id ? record : p))
              : [record, ...next.packages];
            break;
          }
          case "gift-card":
            if (v.expires < DEMO_DATE)
              throw new Error("Choose a future expiry date.");
            next.giftCards.unshift({
              id: newId,
              clientId: v.clientId,
              recipient: v.recipient,
              email: v.email,
              message: v.message,
              value: num("value"),
              balance: num("value"),
              issued: DEMO_DATE,
              expires: v.expires,
              status: "active",
            });
            break;
          case "supplier": {
            const record = {
              id: newId,
              name: v.name,
              contact: v.contact,
              email: v.email,
              phone: v.phone,
              brands: list("brands"),
              status: "active" as const,
            };
            next.suppliers = id
              ? next.suppliers.map((s) => (s.id === id ? record : s))
              : [record, ...next.suppliers];
            break;
          }
          case "purchase-order": {
            const p = next.products.find((p) => p.id === v.productId)!;
            if (p.supplierId !== v.supplierId)
              throw new Error("Choose a product supplied by this supplier.");
            next.purchaseOrders.unshift({
              id: newId,
              supplierId: v.supplierId,
              locationId: v.locationId,
              date: DEMO_DATE,
              expected: v.expected,
              items: [
                {
                  productId: p.id,
                  quantity: num("quantity"),
                  received: 0,
                  cost: p.cost,
                },
              ],
              status: "draft",
            });
            break;
          }
          case "campaign":
            next.campaigns.unshift({
              id: newId,
              name: v.name,
              type: v.type as Campaign["type"],
              audience: v.audience,
              recipients: next.clients.filter((c) =>
                v.audience === "VIP"
                  ? c.tags.includes("VIP")
                  : c.status === "active",
              ).length,
              offer: v.offer,
              status: "draft",
              date: v.date,
            });
            break;
          case "time-off":
            if (v.end < v.start)
              throw new Error("End date must follow start date.");
            next.timeOff.unshift({
              id: newId,
              staffId: v.staffId,
              type: v.type as TimeOffRequest["type"],
              start: v.start,
              end: v.end,
              reason: v.reason,
              status: "pending",
            });
            break;
          case "waitlist":
            if (v.to < v.from)
              throw new Error("End date must follow start date.");
            next.waitlist.unshift({
              id: newId,
              clientId: v.clientId,
              serviceId: v.serviceId,
              staffId: v.staffId,
              from: v.from,
              to: v.to,
              preference: v.preference,
              priority: v.priority as "Normal" | "High",
              status: "waiting",
            });
            break;
          case "stock": {
            const quantity = num("quantity");
            if (!Number.isInteger(quantity) || quantity === 0)
              throw new Error("Use a non-zero whole quantity.");
            if (
              ["Professional Use", "Waste", "Damage"].includes(v.type) &&
              quantity > 0
            )
              throw new Error(
                "Use a negative quantity for product consumption or loss.",
              );
            let level = next.inventory.find(
              (l) =>
                l.productId === v.productId && l.locationId === v.locationId,
            );
            if (!level) {
              level = {
                id: uid("stock"),
                productId: v.productId,
                locationId: v.locationId,
                onHand: 0,
                reserved: 0,
              };
              next.inventory.push(level);
            }
            if (level.onHand + quantity < level.reserved)
              throw new Error(
                "This adjustment would reduce stock below its reserved quantity.",
              );
            level.onHand += quantity;
            next.movements.unshift({
              id: newId,
              productId: v.productId,
              locationId: v.locationId,
              type: v.type as StockMovement["type"],
              quantity,
              reason: v.reason,
              date: now,
            });
            break;
          }
          case "note":
            next.notes.unshift({
              id: newId,
              clientId: contextId!,
              kind: v.kind as ClientNote["kind"],
              text: v.text,
              staffId: "mia-carter",
              date: now,
            });
            break;
          case "formula":
            next.formulas.unshift({
              id: newId,
              clientId: contextId!,
              staffId: "mia-carter",
              date: DEMO_DATE,
              root: v.root,
              lengths: v.lengths,
              developer: v.developer,
              processing: num("processing"),
            });
            break;
          case "membership":
            if (
              next.memberships.some(
                (m) =>
                  m.clientId === v.clientId &&
                  m.planId === v.planId &&
                  m.status === "active",
              )
            )
              throw new Error("This client already has this membership.");
            next.memberships.unshift({
              id: newId,
              clientId: v.clientId,
              planId: v.planId,
              status: "active",
              joined: DEMO_DATE,
              renewal: v.renewal,
              remaining: 1,
            });
            break;
          case "schedule":
            if (
              v.end <= v.start ||
              v.breakEnd <= v.breakStart ||
              v.breakStart < v.start ||
              v.breakEnd > v.end
            )
              throw new Error("Check shift and break times.");
            next.schedules = next.schedules.map((s) =>
              s.id === id
                ? {
                    ...s,
                    start: v.start,
                    end: v.end,
                    breakStart: v.breakStart,
                    breakEnd: v.breakEnd,
                    off: v.off === "true",
                  }
                : s,
            );
            break;
        }
        return next;
      },
      `${kind.replaceAll("-", " ")} ${id ? "updated" : "saved"}`,
    );
    if (ok) onClose();
  }
  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="form-grid">
        {fields.map((f) => (
          <div
            key={f.key}
            className={
              f.type === "textarea" || f.type === "multi" ? "full" : ""
            }
          >
            <Field label={f.label} error={errors[f.key]?.message} hint={f.hint}>
              {f.type === "textarea" ? (
                <textarea {...register(f.key)} />
              ) : f.type === "select" ? (
                <select {...register(f.key)}>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : f.type === "multi" ? (
                <select multiple aria-label={f.label} value={(formValues[f.key]??'').split(',').filter(Boolean)} onChange={e=>setValue(f.key,Array.from(e.target.selectedOptions,o=>o.value).join(','))} size={Math.min(7,f.options?.length??3)}>{f.options?.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>
              ) : (
                <input
                  type={f.type ?? "text"}
                  min={f.min}
                  max={f.max}
                  step={f.type === "number" ? "any" : undefined}
                  {...register(f.key)}
                />
              )}
            </Field>
            {f.type === "multi" && <small className="muted">Hold Command or Ctrl to select multiple options.</small>}
          </div>
        ))}
      </div>
      <div className="form-footer">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="primary">
          {id ? "Save changes" : `Create ${kind.replaceAll("-", " ")}`}
        </Button>
      </div>
    </form>
  );
}
