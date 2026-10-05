import { Providers } from "@/hooks/use-studio";
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Salonly — Your studio, beautifully organized",
    template: "%s | Salonly",
  },
  description:
    "Salonly — Salon, Spa, Barber & Beauty Booking Management Next.js Admin Dashboard. Bookings, clients, staff and revenue — beautifully organized.",
  // Studio workspaces stay out of search engines. Set SALONLY_ALLOW_INDEXING=true
  // only for a public demo you want indexed.
  robots:
    process.env.SALONLY_ALLOW_INDEXING === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
