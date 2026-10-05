import { LoadingSkeleton } from "@/components/ui/primitives";
import { Appointments } from "@/features/appointments/appointments";
import { Suspense } from "react";
export const metadata = { title: "Appointments" };
export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Appointments />
    </Suspense>
  );
}
