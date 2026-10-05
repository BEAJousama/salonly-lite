"use client";
import { Brand, Button, Field } from "@/components/ui/primitives";
import { ArrowRight, Check, Eye, EyeOff, Scissors } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function Auth({
  mode = "sign-in",
}: {
  mode?: "sign-in" | "forgot-password" | "reset-password";
}) {
  const router = useRouter();
  const [email, setEmail] = useState("admin@salonly.demo");
  const [password, setPassword] = useState("salonly");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode === "sign-in") {
      if (email !== "admin@salonly.demo" || password !== "salonly") {
        setError("Use the demo email and password shown below.");
        return;
      }
      router.push("/dashboard");
    } else setSent(true);
  }
  return (
    <div className="auth-layout">
      <section className="auth-editorial">
        <Brand />
        <div>
          <span className="eyebrow">
            A LITTLE CLARITY. A LOT OF POSSIBILITY.
          </span>
          <h1>
            Beautiful work.
            <br />
            Beautifully
            <br />
            <em>organized.</em>
          </h1>
          <p>
            Bookings, clients, staff and revenue —<br />a calmer way to run your
            studio.
          </p>
          <div className="auth-illustration">
            <div className="arch">
              <Scissors size={68} strokeWidth={0.8} />
            </div>
            <span />
            <span />
          </div>
        </div>
        <small>Made for the people who make others feel good.</small>
      </section>
      <section className="auth-form">
        <div>
          <span className="eyebrow">WELCOME TO SALONLY</span>
          <h2>
            {mode === "sign-in"
              ? "A beautiful day starts here."
              : mode === "forgot-password"
                ? "Let’s get you back in."
                : "A fresh start."}
          </h2>
          <p>
            {mode === "sign-in"
              ? "Sign in to your studio workspace."
              : "This is a demo recovery flow. No email is sent."}
          </p>
          {sent ? (
            <div className="form-stack">
              <div className="notice">
                <Check size={17} />
                Demo recovery prepared for {email}.
              </div>
              {mode === "forgot-password" ? (
                <Link className="btn btn-primary" href="/reset-password">
                  Continue demo recovery
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <>
                  <p className="muted">
                    Demo credentials remain admin@salonly.demo / salonly.
                    Connect an authentication provider to enable real password
                    changes.
                  </p>
                  <Link className="btn btn-primary" href="/sign-in">
                    Back to sign in
                  </Link>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={submit}>
              <Field label="Email address">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </Field>
              {mode === "sign-in" && (
                <Field label="Password">
                  <span className="password-field">
                    <input
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      aria-label={show ? "Hide password" : "Show password"}
                      onClick={() => setShow(!show)}
                    >
                      {show ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </span>
                </Field>
              )}
              {error && (
                <p className="text-danger" role="alert">
                  {error}
                </p>
              )}
              {mode === "sign-in" && (
                <Link href="/forgot-password" className="text-link">
                  Forgot password?
                </Link>
              )}
              <Button type="submit" variant="primary">
                {mode === "sign-in"
                  ? "Sign in to your studio"
                  : "Continue demo recovery"}
                <ArrowRight size={15} />
              </Button>
            </form>
          )}
          {mode === "sign-in" && (
            <div className="demo-credentials">
              <span>EXPLORE THE DEMO</span>
              <p>
                admin@salonly.demo <b>·</b> salonly
              </p>
              <small>
                No account needed. No real payments. Just possibilities.
              </small>
            </div>
          )}
          <div className="auth-footer">
            Salonly Studio · A thoughtful space for your business.
          </div>
        </div>
      </section>
    </div>
  );
}
