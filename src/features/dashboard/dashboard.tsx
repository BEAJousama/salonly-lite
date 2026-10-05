"use client";
import {
  Avatar,
  Badge,
  Card,
  LinkButton,
  Metric,
  PageHeader,
  Person,
  Progress,
  ViewAll,
} from "@/components/ui/primitives";
import { locations } from "@/data/catalog";
import { useStudio } from "@/hooks/use-studio";
import { DEMO_DATE, formatCurrency, formatTime } from "@/lib/format";
import { format, subDays } from "date-fns";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Plus,
  ShoppingBag,
  Sparkles,
  UserRoundCheck,
  Users,
  Wallet,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
const RevenueChart = dynamic(
  () => import("@/features/dashboard/revenue-chart").then((m) => m.RevenueChart),
  {
    ssr: false,
    loading: () => <div className="skeleton" style={{ height: 210 }} />,
  },
);
export function Dashboard() {
  const { state, location, setStatus } = useStudio();
  const [range, setRange] = useState("30D");
  const today = state.appointments.filter(
    (a) =>
      a.date === DEMO_DATE && (location === "all" || a.locationId === location),
  );
  const sales = state.sales.filter(
    (s) => location === "all" || s.locationId === location,
  );
  const todaySales = sales.filter((s) => s.date.startsWith(DEMO_DATE));
  const revenue = todaySales.reduce((sum, s) => sum + s.total - s.tip, 0);
  const activeStaff = state.staff.filter(
    (s) => location === "all" || s.locationId === location,
  );
  const bookedValue = today
    .filter((a) => !["cancelled", "no-show"].includes(a.status))
    .reduce((sum, a) => sum + a.services.reduce((n, s) => n + s.price, 0), 0);
  const days =
    range === "7D" ? 7 : range === "30D" ? 30 : range === "90D" ? 90 : 365;
  const chart = Array.from(
    { length: range === "12M" ? 12 : days === 90 ? 13 : days },
    (_, i) => {
      const date = format(
        subDays(
          new Date("2026-10-04T12:00:00"),
          range === "12M"
            ? (11 - i) * 30
            : days === 90
              ? (12 - i) * 7
              : days - 1 - i,
        ),
        "yyyy-MM-dd",
      );
      const selected = sales.filter((s) =>
        range === "12M"
          ? s.date.startsWith(date.slice(0, 7))
          : days === 90
            ? s.date.slice(0, 10) >= date &&
              s.date.slice(0, 10) <
                format(subDays(new Date(date + "T12:00:00"), -7), "yyyy-MM-dd")
            : s.date.startsWith(date),
      );
      return {
        name: format(
          new Date(date + "T12:00:00"),
          range === "12M" ? "MMM" : "MMM d",
        ),
        services: selected.reduce(
          (n, s) =>
            n +
            s.items
              .filter((i) => i.type === "service")
              .reduce((n, i) => n + i.price * i.quantity, 0),
          0,
        ),
        retail: selected.reduce(
          (n, s) =>
            n +
            s.items
              .filter((i) => i.type === "product")
              .reduce((n, i) => n + i.price * i.quantity, 0),
          0,
        ),
        memberships: 0,
      };
    },
  );
  const statuses = [
    "confirmed",
    "checked-in",
    "in-service",
    "completed",
    "cancelled",
    "no-show",
  ];
  const colors = [
    "var(--chart)",
    "var(--accent)",
    "var(--warning)",
    "var(--primary)",
    "var(--border)",
    "var(--slate)",
  ];
  let cumulative = 0;
  const gradient = statuses
    .map((status, i) => {
      const start = cumulative;
      cumulative +=
        (today.filter((a) => a.status === status).length /
          Math.max(1, today.length)) *
        100;
      return `${colors[i]} ${start}% ${cumulative}%`;
    })
    .join(",");
  const top = state.services
    .map((s) => ({
      ...s,
      bookings: state.appointments.filter(
        (a) =>
          a.services.some((v) => v.serviceId === s.id) &&
          a.status === "completed" &&
          (location === "all" || a.locationId === location),
      ),
    }))
    .sort((a, b) => b.bookings.length * b.price - a.bookings.length * a.price)
    .slice(0, 4);
  const low = state.inventory
    .filter(
      (i) =>
        (location === "all" || i.locationId === location) &&
        i.onHand <=
          (state.products.find((p) => p.id === i.productId)?.reorder ?? 0),
    )
    .slice(0, 3);
  return (
    <>
      <PageHeader
        title="Good morning, Mia"
        description={`Here's how ${location === "all" ? "your studios" : locations.find((l) => l.id === location)?.name} is looking today.`}
        eyebrow="A LITTLE CLARITY FOR YOUR DAY"
        actions={
          <>
            <LinkButton href="/pos">
              <ShoppingBag size={15} />
              Open POS
            </LinkButton>
            <LinkButton href="/appointments/new" primary>
              <Plus size={15} />
              New appointment
            </LinkButton>
          </>
        }
      />
      <div className="dashboard-date-row">
        <div className="welcome-strip">
          <span />
          Your studio, at a glance
        </div>
        <div className="today-control">
          <CalendarDays />
          Sunday, October 4, 2026
          <Badge status="Live overview" />
        </div>
      </div>
      <div className="metrics">
        <Metric
          label="Today's bookings"
          value={String(today.length)}
          detail={`${today.filter((a) => a.status === "completed").length} completed today`}
          icon={<CalendarCheck />}
        />
        <Metric
          label="Clients today"
          value={String(new Set(today.map((a) => a.clientId)).size)}
          detail={`${today.filter((a) => a.status === "checked-in").length} clients checked in`}
          icon={<Users />}
        />
        <Metric
          label="Today's revenue"
          value={formatCurrency(revenue)}
          detail={`${formatCurrency(bookedValue)} in booked services`}
          icon={<Wallet />}
        />
        <Metric
          label="Available specialists"
          value={String(
            activeStaff.filter(
              (s) =>
                !today.some(
                  (a) =>
                    a.status === "in-service" &&
                    a.services.some((v) => v.staffId === s.id),
                ),
            ).length,
          )}
          detail={`of ${activeStaff.length} on the team`}
          icon={<UserRoundCheck />}
        />
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-column">
          <Card
            title="Revenue overview"
            subtitle="A little perspective on your studio's growth"
            action={
              <div className="range-tabs">
                {["7D", "30D", "90D", "12M"].map((r) => (
                  <button
                    key={r}
                    className={range === r ? "active" : ""}
                    onClick={() => setRange(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            }
          >
            <div className="chart-summary">
              <div className="chart-total">
                {formatCurrency(
                  chart.reduce((n, c) => n + c.services + c.retail, 0),
                )}
              </div>
              <small>{range} service & retail sales</small>
            </div>
            <RevenueChart data={chart} />
            <div className="chart-legend">
              <span>
                <i className="legend-dot" />
                Services
              </span>
              <span>
                <i className="legend-dot retail" />
                Retail
              </span>
              <span style={{ marginLeft: "auto" }}>Excludes tax & tips</span>
            </div>
          </Card>
          <Card
            title="Today's appointments"
            subtitle={`${today.length} moments to make someone's day`}
            action={<ViewAll href="/calendar" label="Open calendar" />}
            flush
          >
            <div className="schedule-head">
              <span className="muted" style={{ fontSize: 10 }}>
                SUNDAY, OCTOBER 4
              </span>
              <span className="muted" style={{ fontSize: 10 }}>
                All specialists
              </span>
            </div>
            {[...today]
              .sort((a, b) => a.time.localeCompare(b.time))
              .slice(0, 6)
              .map((a) => {
                const client = state.clients.find((c) => c.id === a.clientId)!;
                const specialist = state.staff.find(
                  (s) => s.id === a.services[0].staffId,
                )!;
                return (
                  <div className="schedule-row" key={a.id}>
                    <div className="schedule-time">
                      {formatTime(a.time).split(" ")[0]}
                      <small>{formatTime(a.time).split(" ")[1]}</small>
                    </div>
                    <Person
                      name={client.name}
                      detail={a.services
                        .map(
                          (s) =>
                            state.services.find((v) => v.id === s.serviceId)
                              ?.name,
                        )
                        .join(" + ")}
                      href={`/appointments/${a.id}`}
                    />
                    <div className="schedule-staff">
                      <Person name={specialist.name} color={specialist.color} />
                    </div>
                    <Badge status={a.status} />
                    {a.status === "confirmed" ? (
                      <button
                        className="icon-button"
                        aria-label={`Check in ${client.name}`}
                        title="Check in"
                        onClick={() => setStatus(a.id, "checked-in")}
                      >
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <Link
                        className="icon-button"
                        href={`/appointments/${a.id}`}
                        aria-label={`View ${client.name}'s appointment`}
                      >
                        <ChevronRight size={14} />
                      </Link>
                    )}
                  </div>
                );
              })}
          </Card>
          <div className="two-small">
            <Card
              title="Most-loved services"
              subtitle="Completed appointments this period"
              action={<ViewAll href="/reports?tab=Services" />}
            >
              {top.map((s, i) => (
                <div className="service-rank" key={s.id}>
                  <span className="rank-number">0{i + 1}</span>
                  <div>
                    <strong>{s.name}</strong>
                    <small>{s.bookings.length} bookings</small>
                  </div>
                  <b>{formatCurrency(s.bookings.length * s.price)}</b>
                </div>
              ))}
            </Card>
            <Card
              title="Client connections"
              subtitle="Relationships that keep growing"
              action={<Users size={16} className="muted" />}
            >
              <div className="client-insight">
                <div>
                  <strong>
                    {
                      state.clients.filter(
                        (c) => c.locationId === location || location === "all",
                      ).length
                    }
                  </strong>
                  <span>Clients in your studio</span>
                </div>
                <div className="avatar-stack">
                  {state.clients.slice(0, 5).map((c) => (
                    <Avatar key={c.id} name={c.name} />
                  ))}
                </div>
              </div>
              <div className="info-row">
                <span>Returning clients</span>
                <strong>
                  {
                    state.clients.filter(
                      (c) =>
                        c.visits > 1 &&
                        (location === "all" || c.locationId === location),
                    ).length
                  }
                </strong>
              </div>
              <div className="info-row">
                <span>Rebooking rate</span>
                <strong>
                  {Math.round(
                    (today.filter((a) => a.rebooked).length /
                      Math.max(today.length, 1)) *
                      100,
                  )}
                  %
                </strong>
              </div>
              <Link
                href="/clients?segment=vip"
                className="text-link"
                style={{ marginTop: 13 }}
              >
                Get to know your clients
                <ArrowUpRight size={13} />
              </Link>
            </Card>
          </div>
        </div>
        <div className="dashboard-column">
          <Card
            title="Today's booking status"
            subtitle="Every appointment, in the right place"
          >
            <div className="donut-wrap">
              <div
                className="donut"
                style={{ background: `conic-gradient(${gradient})` }}
              >
                <div className="donut-hole">
                  <strong>{today.length}</strong>
                  <span>appointments</span>
                </div>
              </div>
              <div className="donut-legend">
                {statuses.slice(0, 4).map((s, i) => (
                  <div key={s}>
                    <i
                      className="legend-dot"
                      style={{ background: colors[i] }}
                    />
                    <span>
                      {s
                        .replaceAll("-", " ")
                        .replace(/^./, (s) => s.toUpperCase())}
                    </span>
                    <b>{today.filter((a) => a.status === s).length}</b>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card
            title="Your team today"
            subtitle="A balanced day makes a happy team"
            action={<ViewAll href="/staff" />}
          >
            {activeStaff.slice(0, 4).map((s) => {
              const booked = today
                .filter((a) => !["cancelled", "no-show"].includes(a.status))
                .reduce(
                  (n, a) =>
                    n +
                    a.services
                      .filter((v) => v.staffId === s.id)
                      .reduce((n, v) => n + v.duration, 0),
                  0,
                );
              return (
                <div className="staff-utilization" key={s.id}>
                  <div className="person">
                    <Avatar name={s.name} color={s.color} />
                    <span>
                      <strong>{s.name}</strong>
                      <small>{s.role}</small>
                    </span>
                    <span>
                      {Math.round((booked / (s.hours * 60)) * 100)}%
                      <small>
                        {(booked / 60).toFixed(1)} / {s.hours} hrs
                      </small>
                    </span>
                  </div>
                  <Progress
                    value={(booked / (s.hours * 60)) * 100}
                    label={`${s.name} utilization`}
                  />
                </div>
              );
            })}
            <div className="insight-banner">
              <Sparkles size={15} />
              <span>
                A little room to grow. Find an open slot for a client on your
                waitlist.
              </span>
            </div>
          </Card>
          <Card
            title="A little stock check"
            subtitle="Essentials that could use a top-up"
            action={
              <span className="badge badge-warning">{low.length} alerts</span>
            }
          >
            {low.map((i) => {
              const product = state.products.find((p) => p.id === i.productId)!;
              return (
                <Link
                  href={`/products/${product.id}`}
                  className="inventory-alert"
                  key={i.id}
                >
                  <span className="bottle-thumb">
                    <span className="bottle" />
                  </span>
                  <div>
                    <strong>
                      {product.brand}{" "}
                      {product.name.split(" ").slice(0, 3).join(" ")}
                    </strong>
                    <small>{product.category}</small>
                  </div>
                  <span className="badge badge-warning">{i.onHand} left</span>
                </Link>
              );
            })}
            <div style={{ marginTop: 16 }}>
              <ViewAll href="/inventory" label="View stock overview" />
            </div>
          </Card>
          <Card
            title="Around the studio"
            action={<span className="live-dot" />}
          >
            {state.activity.slice(0, 4).map((e) => (
              <div key={e.id} className="activity-item">
                <span className="activity-dot" />
                <div>
                  <p>{e.text}</p>
                  <small>
                    {new Date(e.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
