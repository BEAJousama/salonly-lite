import type { AppointmentStatus } from "@/types/domain";
export const appointmentStatuses: Record<
  AppointmentStatus,
  { label: string; tone: string }
> = {
  pending: { label: "Pending", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "info" },
  "checked-in": { label: "Checked in", tone: "accent" },
  "in-service": { label: "In service", tone: "accent" },
  completed: { label: "Completed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
  "no-show": { label: "No show", tone: "danger" },
};
export function statusMeta(status: string) {
  if (status in appointmentStatuses)
    return appointmentStatuses[status as AppointmentStatus];
  const tone = [
    "paid",
    "active",
    "approved",
    "received",
    "available",
    "in-stock",
    "sent",
    "booked",
  ].includes(status)
    ? "success"
    : [
          "pending",
          "waiting",
          "low-stock",
          "ordered",
          "partially-paid",
          "partially-received",
          "past-due",
        ].includes(status)
      ? "warning"
      : [
            "overdue",
            "out-of-stock",
            "failed",
            "rejected",
            "expired",
            "disabled",
          ].includes(status)
        ? "danger"
        : ["matched", "contacted", "scheduled", "occupied"].includes(status)
          ? "info"
          : "neutral";
  return {
    label: status.replaceAll("-", " ").replace(/^./, (s) => s.toUpperCase()),
    tone,
  };
}
