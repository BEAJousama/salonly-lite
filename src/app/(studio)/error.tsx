"use client";
import { Button } from "@/components/ui/primitives";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="empty-state">
      <h1>A moment to reset</h1>
      <p>We couldn’t load this part of your studio. Please try again.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
