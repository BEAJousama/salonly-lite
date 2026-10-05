import { format, parseISO } from "date-fns";
export const DEMO_DATE = "2026-10-04";
/** The studio clock in demo mode, just before Emma Walker's 10:30 visit. */
export const DEMO_TIME = "10:20";
export const formatCurrency = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
export const formatDate = (value: string, pattern = "MMM d, yyyy") =>
  value ? format(parseISO(value), pattern) : "—";
export const formatTime = (value: string) =>
  format(parseISO(`${DEMO_DATE}T${value}`), "h:mm a");
export const minutes = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};
export const timeFromMinutes = (value: number) =>
  `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
export const durationLabel = (value: number) =>
  `${Math.floor(value / 60) ? `${Math.floor(value / 60)}h ` : ""}${value % 60 ? `${value % 60}m` : ""}`.trim();
export const uid = (prefix: string) =>
  `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
export const cn = (...values: (string | false | undefined)[]) =>
  values.filter(Boolean).join(" ");
export function downloadCSV(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const quote = (v: unknown) => {
    let s = typeof v === "object" ? JSON.stringify(v) : String(v ?? "");
    if (/^[=+@\-\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replaceAll('"', '""')}"`;
  };
  const blob = new Blob(
    [
      [
        keys.map(quote).join(","),
        ...rows.map((r) => keys.map((k) => quote(r[k])).join(",")),
      ].join("\n"),
    ],
    { type: "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
