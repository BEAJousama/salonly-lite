import { LoadingSkeleton } from "@/components/ui/primitives";
import { Clients } from "@/features/clients/clients";
import { Suspense } from "react";
export const metadata = { title: "Clients" };
export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Clients />
    </Suspense>
  );
}
