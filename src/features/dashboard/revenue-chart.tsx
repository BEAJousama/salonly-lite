"use client";
import { formatCurrency } from "@/lib/format";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
export interface RevenuePoint {
  name: string;
  services: number;
  retail: number;
  memberships: number;
}
export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div style={{ width: "100%", height: 210, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 12, right: 8, left: -22, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart)" stopOpacity={0.22} />
              <stop
                offset="100%"
                stopColor="var(--chart)"
                stopOpacity={0.015}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="var(--border)"
            vertical={false}
            strokeDasharray="3 5"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: "var(--muted)" }}
            dy={8}
            minTickGap={25}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: "var(--muted)" }}
            tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
          />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--foreground)",
              fontSize: 11,
            }}
            formatter={(v) => formatCurrency(Number(v))}
          />
          <Area
            type="monotone"
            dataKey="services"
            name="Services"
            stroke="var(--chart)"
            strokeWidth={2.3}
            fill="url(#revenue-fill)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="retail"
            name="Retail"
            stroke="var(--accent)"
            strokeWidth={1.5}
            fill="transparent"
            strokeDasharray="4 4"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
