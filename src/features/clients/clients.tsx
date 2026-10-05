"use client";
import { DataTable, type Column } from "@/components/ui/data-table";
import {
  Badge,
  Button,
  Metric,
  PageHeader,
  Person,
} from "@/components/ui/primitives";
import { EntityEditor } from "@/features/records/entity-editor";
import { useStudio } from "@/hooks/use-studio";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Client } from "@/types/domain";
import { Heart, Plus, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
export function Clients() {
  const { state, location } = useStudio();
  const params = useSearchParams();
  const router = useRouter();
  const [create, setCreate] = useState(params.has("create"));
  const segment = params.get("segment") ?? "all";
  const clients = state.clients.filter(
    (c) =>
      (location === "all" || c.locationId === location) &&
      (segment === "all" ||
        (segment === "vip"
          ? c.tags.includes("VIP")
          : segment === "membership"
            ? state.memberships.some(
                (m) => m.clientId === c.id && m.status === "active",
              )
            : segment === "new"
              ? c.visits < 2
              : segment === "inactive"
                ? c.status === "inactive"
                : !state.appointments.some(
                    (a) =>
                      a.clientId === c.id &&
                      a.date >= "2026-10-04" &&
                      !["cancelled", "completed"].includes(a.status),
                  ))),
  );
  const columns: Column<Client>[] = [
    {
      accessorKey: "name",
      header: "Client",
      cell: ({ row }) => (
        <Person
          name={row.original.name}
          detail={`Client since ${formatDate(row.original.joined, "MMM yyyy")}`}
          href={`/clients/${row.original.id}`}
        />
      ),
    },
    {
      id: "contact",
      accessorFn: (c) => `${c.email} ${c.phone}`,
      header: "Contact",
      cell: ({ row }) => (
        <div>
          {row.original.email}
          <small className="cell-secondary">{row.original.phone}</small>
        </div>
      ),
    },
    {
      accessorKey: "lastVisit",
      header: "Last visit",
      cell: ({ getValue }) => formatDate(String(getValue())),
    },
    {
      id: "next",
      header: "Next booking",
      accessorFn: (c) =>
        state.appointments
          .filter(
            (a) =>
              a.clientId === c.id &&
              a.date >= "2026-10-04" &&
              !["cancelled", "completed"].includes(a.status),
          )
          .sort((a, b) => a.date.localeCompare(b.date))[0]?.date ?? "",
      cell: ({ getValue }) =>
        getValue() ? (
          formatDate(String(getValue()), "MMM d")
        ) : (
          <span className="muted">Not booked</span>
        ),
    },
    { accessorKey: "visits", header: "Visits" },
    {
      id: "spend",
      accessorFn: (c) =>
        c.openingSpend +
        state.sales
          .filter((s) => s.clientId === c.id && s.date >= "2026-10-04")
          .reduce((n, s) => n + s.total, 0),
      header: "Lifetime spend",
      cell: ({ getValue }) => (
        <span className="table-money">
          {formatCurrency(Number(getValue()))}
        </span>
      ),
    },
    {
      id: "loyalty",
      header: "Loyalty",
      cell: ({ row }) => (
        <span className="loyalty-tier">
          {state.loyalty.find((l) => l.clientId === row.original.id)?.tier ??
            "Bronze"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <Badge status={String(getValue())} />,
    },
  ];
  return (
    <>
      <PageHeader
        title="Good people. Great relationships."
        eyebrow="YOUR CLIENTS"
        description="Remember the details. Make every visit feel personal."
        actions={
          <Button variant="primary" onClick={() => setCreate(true)}>
            <Plus size={15} />
            Add client
          </Button>
        }
      />
      <div className="metrics">
        <Metric
          label="Studio clients"
          value={String(clients.length)}
          detail="In selected segment"
          icon={<Users />}
        />
        <Metric
          label="VIP clients"
          value={String(clients.filter((c) => c.tags.includes("VIP")).length)}
          detail="Your most loyal connections"
          icon={<Heart />}
        />
        <Metric
          label="Active memberships"
          value={String(
            state.memberships.filter(
              (m) =>
                clients.some((c) => c.id === m.clientId) &&
                m.status === "active",
            ).length,
          )}
          detail="A ritual worth returning to"
        />
        <Metric
          label="Average lifetime spend"
          value={formatCurrency(
            clients.reduce((n, c) => n + c.openingSpend, 0) /
              Math.max(1, clients.length),
          )}
          detail="Historical client value"
        />
      </div>
      <DataTable
        data={clients}
        columns={columns}
        placeholder="Search name, email or phone…"
        toolbar={
          <select
            aria-label="Client segment"
            value={segment}
            onChange={(e) =>
              router.replace(`/clients?segment=${e.target.value}`)
            }
          >
            {[
              ["all", "All clients"],
              ["vip", "VIP"],
              ["membership", "Membership"],
              ["new", "New clients"],
              ["no-booking", "No upcoming booking"],
              ["inactive", "Inactive"],
            ].map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        }
      />
      <EntityEditor
        kind="client"
        open={create}
        onClose={() => setCreate(false)}
      />
    </>
  );
}
