"use client";
import { DataTable, type Column } from "@/components/ui/data-table";
import {
  Badge,
  LinkButton,
  Metric,
  PageHeader,
  Person,
} from "@/components/ui/primitives";
import { useStudio } from "@/hooks/use-studio";
import {
  durationLabel,
  formatCurrency,
  formatDate,
  formatTime,
} from "@/lib/format";
import { appointmentStatuses } from "@/lib/status";
import type { Appointment } from "@/types/domain";
import { CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
export function Appointments() {
  const { state, location } = useStudio();
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get("status") ?? "all",
    staff = params.get("staff") ?? "all",
    date = params.get("date") ?? "";
  const data = state.appointments.filter(
    (a) =>
      (location === "all" || a.locationId === location) &&
      (status === "all" || a.status === status) &&
      (staff === "all" || a.services.some((s) => s.staffId === staff)) &&
      (!date || a.date === date),
  );
  function filter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    router.replace(`/appointments?${next}`);
  }
  const columns: Column<Appointment>[] = [
    {
      accessorKey: "id",
      header: "Appointment",
      cell: ({ row }) => (
        <Link className="text-link" href={`/appointments/${row.original.id}`}>
          {row.original.id}
        </Link>
      ),
    },
    {
      id: "client",
      accessorFn: (a) => {
        const c = state.clients.find((c) => c.id === a.clientId);
        return `${c?.name} ${c?.phone} ${c?.email}`;
      },
      header: "Client",
      cell: ({ row }) => {
        const c = state.clients.find((c) => c.id === row.original.clientId)!;
        return (
          <Person name={c.name} detail={c.phone} href={`/clients/${c.id}`} />
        );
      },
    },
    {
      id: "service",
      header: "Service",
      accessorFn: (a) =>
        a.services
          .map((v) => state.services.find((s) => s.id === v.serviceId)?.name)
          .join(" + "),
      cell: ({ row, getValue }) => (
        <div>
          <strong style={{ fontWeight: 500 }}>{String(getValue())}</strong>
          <small className="cell-secondary">
            {durationLabel(
              row.original.services.reduce((n, s) => n + s.duration, 0),
            )}
          </small>
        </div>
      ),
    },
    {
      id: "staff",
      header: "Specialist",
      accessorFn: (a) =>
        state.staff.find((s) => s.id === a.services[0].staffId)?.name,
    },
    {
      accessorKey: "date",
      header: "Date & time",
      cell: ({ row }) => (
        <div>
          {formatDate(row.original.date, "MMM d, yyyy")}
          <small className="cell-secondary">
            {formatTime(row.original.time)}
          </small>
        </div>
      ),
    },
    {
      id: "amount",
      accessorFn: (a) => a.services.reduce((n, s) => n + s.price, 0),
      header: "Amount",
      cell: ({ getValue }) => (
        <span className="table-money">
          {formatCurrency(Number(getValue()))}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge status={row.original.status} />,
    },
  ];
  return (
    <>
      <PageHeader
        title="Appointments"
        description="Every visit, from the first hello to the next booking."
        actions={
          <>
            <LinkButton href="/calendar">
              <CalendarDays size={15} />
              Calendar
            </LinkButton>
            <LinkButton href="/appointments/new" primary>
              <Plus size={15} />
              New appointment
            </LinkButton>
          </>
        }
      />
      <div className="metrics">
        {[
          ["All appointments", data.length],
          ["Confirmed", data.filter((a) => a.status === "confirmed").length],
          [
            "In the studio",
            data.filter((a) => ["checked-in", "in-service"].includes(a.status))
              .length,
          ],
          ["Completed", data.filter((a) => a.status === "completed").length],
        ].map(([label, value]) => (
          <Metric
            key={label}
            label={String(label)}
            value={String(value)}
            detail="In selected view"
          />
        ))}
      </div>
      <DataTable
        data={data}
        columns={columns}
        placeholder="Search client, email, phone or booking…"
        toolbar={
          <>
            <input
              type="date"
              aria-label="Appointment date"
              value={date}
              onChange={(e) => filter("date", e.target.value)}
            />
            <select
              aria-label="Status filter"
              value={status}
              onChange={(e) => filter("status", e.target.value)}
            >
              <option value="all">All statuses</option>
              {Object.entries(appointmentStatuses).map(([v, s]) => (
                <option key={v} value={v}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              aria-label="Staff filter"
              value={staff}
              onChange={(e) => filter("staff", e.target.value)}
            >
              <option value="all">All specialists</option>
              {state.staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </>
        }
      />
    </>
  );
}
