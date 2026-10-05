import { LoadingSkeleton } from "@/components/ui/primitives";
import { Dashboard } from "@/features/dashboard/dashboard";
import { Suspense } from "react";
export const metadata = { title: "Dashboard" };
export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
