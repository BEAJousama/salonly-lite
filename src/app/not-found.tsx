import Link from "next/link";
export default function NotFound() {
  return (
    <main
      className="empty-state"
      style={{ minHeight: "100vh", justifyContent: "center" }}
    >
      <span className="eyebrow">SALONLY · 404</span>
      <h1>A little off the beaten path</h1>
      <p>This page isn’t part of your studio workspace.</p>
      <Link className="btn btn-primary" href="/dashboard">
        Back to your studio
      </Link>
    </main>
  );
}
