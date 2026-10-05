import { notFound } from "next/navigation";
import { ProFeature } from "@/components/shell/pro-feature";
import { createDemoState } from "@/data/demo";
import { proFeatures } from "@/lib/pro";

// Only these Pro preview URLs exist; anything else is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  const s = createDemoState();
  const settings = [
    "general",
    "business",
    "locations",
    "booking",
    "staff",
    "payments",
    "taxes",
    "loyalty",
    "notifications",
    "appearance",
    "integrations",
    "profile",
  ];
  return [
    // "clients" and "appointments" alone are Lite pages, so only their sub-pages land here.
    ...Object.keys(proFeatures)
      .filter((key) => key !== "clients" && key !== "appointments")
      .map((key) => [key]),
    ["team", "schedule"],
    ["appointments", "new"],
    ...s.appointments.map((a) => ["appointments", a.id]),
    ...s.clients.map((c) => ["clients", c.id]),
    ...s.staff.map((m) => ["staff", m.id]),
    ...s.products.map((p) => ["products", p.id]),
    ...s.suppliers.map((p) => ["suppliers", p.id]),
    ...s.invoices.map((i) => ["invoices", i.id]),
    ...s.purchaseOrders.map((p) => ["purchase-orders", p.id]),
    ...settings.map((section) => ["settings", section]),
  ].map((path) => ({ path }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  return { title: proFeatures[path[0]]?.title ?? "Not found" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  if (!proFeatures[path[0]]) notFound();
  return <ProFeature path={path} />;
}
