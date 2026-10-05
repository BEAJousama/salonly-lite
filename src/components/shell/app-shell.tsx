"use client";
import {
  Avatar,
  Brand,
  IconButton,
  Menu,
  Modal,
  LoadingSkeleton,
} from "@/components/ui/primitives";
import { locations } from "@/data/catalog";
import { useStudio } from "@/hooks/use-studio";
import { cn } from "@/lib/format";
import { navigation } from "@/lib/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  Command,
  MapPin,
  Menu as MenuIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { state, location, setLocation, ready } = useStudio();
  const { setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [command, setCommand] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommand((v) => !v);
      }
      if (e.key === "Escape") setMobile(false);
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  const entries = [
    ...navigation.flatMap((g) =>
      g.items.map((i) => ({ name: i.label, type: "Page", href: i.href })),
    ),
    ...state.clients.map((c) => ({
      name: c.name,
      type: "Client",
      href: `/clients/${c.id}`,
    })),
    ...state.staff.map((c) => ({
      name: c.name,
      type: "Staff",
      href: `/staff/${c.id}`,
    })),
    ...state.appointments.map((a) => ({
      name: `${a.id} · ${state.clients.find((c) => c.id === a.clientId)?.name}`,
      type: "Appointment",
      href: `/appointments/${a.id}`,
    })),
    ...state.services.map((s) => ({
      name: s.name,
      type: "Service",
      href: `/services?search=${encodeURIComponent(s.name)}`,
    })),
    ...state.products.map((p) => ({
      name: p.name,
      type: "Product",
      href: `/products/${p.id}`,
    })),
    ...state.invoices.map((i) => ({
      name: i.id,
      type: "Invoice",
      href: `/invoices/${i.id}`,
    })),
    {
      name: "New appointment",
      type: "Quick action",
      href: "/appointments/new",
    },
    { name: "Add client", type: "Quick action", href: "/clients?create=1" },
    { name: "Open POS", type: "Quick action", href: "/pos" },
  ]
    .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 14);
  const go = (href: string) => {
    setCommand(false);
    setMobile(false);
    router.push(href);
  };
  const side = (
    <>
      <div className="sidebar-brand">
        <Brand compact={collapsed && !mobile} />
        <IconButton
          label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
        </IconButton>
      </div>
      <div className="workspace-label">
        <span className="workspace-avatar">S</span>
        <span>
          Salonly Studio<small>Professional workspace</small>
        </span>
        <ChevronDown size={14} />
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            {group.items.map((item) => (
              <Link
                title={item.label}
                key={item.href}
                href={item.href}
                aria-current={
                  path === item.href || path.startsWith(item.href + "/")
                    ? "page"
                    : undefined
                }
                className={cn(
                  "nav-item",
                  (path === item.href || path.startsWith(item.href + "/")) &&
                    "active",
                )}
                onClick={() => setMobile(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.pro && <em className="pro-badge">PRO</em>}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <span className="live-dot" />
        <span>All systems looking good</span>
        <ArrowUpRight size={13} />
      </div>
      <Link className="sidebar-user" href="/settings/profile">
        <Avatar name={state.user.name} />
        <span>
          <strong>{state.user.name}</strong>
          <small>Studio owner</small>
        </span>
        <ChevronDown size={14} />
      </Link>
    </>
  );
  return (
    <div className={cn("app-shell", collapsed && "is-collapsed")}>
      <aside className="sidebar">{side}</aside>
      <Modal
        open={mobile}
        onClose={() => setMobile(false)}
        title="Your workspace"
        description="Navigate Salonly"
        drawer
      >
        <div className="mobile-nav">
          {navigation.map((g) => (
            <div key={g.label}>
              <div className="eyebrow">{g.label}</div>
              {g.items.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  onClick={() => setMobile(false)}
                  className="nav-item"
                >
                  <i.icon size={17} />
                  {i.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </Modal>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-left">
            <span className="mobile-menu">
              <IconButton
                label="Open navigation"
                onClick={() => setMobile(true)}
              >
                <MenuIcon size={21} />
              </IconButton>
            </span>
            <MapPin size={16} />
            <select
              aria-label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
              <option value="all">All Locations</option>
            </select>
            <span className="header-divider" />
            <span className="header-breadcrumb">
              {navigation
                .flatMap((g) => g.items)
                .find((i) => path === i.href || path.startsWith(i.href + "/"))
                ?.label ?? "Studio workspace"}
            </span>
          </div>
          <div className="topbar-actions">
            <button
              className="global-search"
              onClick={() => {
                setCommand(true);
                setSelected(0);
              }}
            >
              <Search size={16} />
              <span>Search anything…</span>
              <kbd>⌘ K</kbd>
            </button>
            <Menu
              label="Quick create"
              items={[
                ["Appointment", "/appointments/new"],
                ["Client", "/clients?create=1"],
                ["Sale", "/pos"],
                ["Staff member", "/staff?create=1"],
                ["Service", "/services?create=1"],
                ["Product", "/products?create=1"],
                ["Package", "/packages?create=1"],
                ["Gift card", "/gift-cards?create=1"],
              ].map(([label, href]) => ({
                label: `New ${label.toLowerCase()}`,
                onClick: () => go(href),
              }))}
            >
              <Plus size={15} />
              <span className="hide-mobile">New</span>
            </Menu>
            <Menu
              label="Theme"
              items={[
                { label: "Light", onClick: () => setTheme("light") },
                { label: "Dark", onClick: () => setTheme("dark") },
                { label: "System", onClick: () => setTheme("system") },
              ]}
            >
              <Sun size={17} />
            </Menu>
            <Link
              className="notification-button icon-button"
              href="/notifications"
              aria-label="Notifications"
            >
              <Bell size={19} />
              {state.notifications.some((n) => !n.read) && <i />}
            </Link>
            <Menu
              label="User menu"
              items={[
                { label: "Profile", onClick: () => go("/settings/profile") },
                {
                  label: "Preferences",
                  onClick: () => go("/settings/appearance"),
                },
                { label: "Notifications", onClick: () => go("/notifications") },
                { label: "Sign out of demo", onClick: () => go("/sign-in") },
              ]}
            >
              <Avatar size="sm" name={state.user.name} />
            </Menu>
          </div>
        </header>
        <main className="main-content" id="main-content">
          {ready ? children : <LoadingSkeleton />}
        </main>
        <footer className="workspace-footer">
          <span>
            Salonly Studio <span>·</span> Your day, beautifully organized.
          </span>
          <span>
            Demo workspace <span>·</span> October 4, 2026
          </span>
        </footer>
      </div>
      <Modal
        open={command}
        onClose={() => setCommand(false)}
        title="Search Salonly"
        description="Find a client, booking, product or page."
        wide
      >
        <div className="command-search">
          <Search size={20} />
          <input
            autoFocus
            placeholder="Search Salonly…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            aria-label="Search Salonly"
            role="combobox"
            aria-controls="command-results"
            aria-expanded="true"
            aria-activedescendant={`command-${selected}`}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected((v) => (v + 1) % Math.max(1, entries.length));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected(
                  (v) => (v - 1 + entries.length) % Math.max(1, entries.length),
                );
              }
              if (e.key === "Enter" && entries[selected])
                go(entries[selected].href);
            }}
          />
        </div>
        <div id="command-results" role="listbox" className="command-results">
          {entries.map((e, i) => (
            <button
              id={`command-${i}`}
              role="option"
              aria-selected={selected === i}
              key={e.href + e.type}
              onClick={() => go(e.href)}
              className={cn("command-result", selected === i && "selected")}
            >
              <span>
                <small>{e.type}</small>
                {e.name}
              </span>
              <ArrowRight size={16} />
            </button>
          ))}
          {entries.length === 0 && (
            <p className="muted">
              No results. Try a client name or booking number.
            </p>
          )}
        </div>
        <div className="command-footer">
          <Command size={13} /> ↑ ↓ to navigate · Enter to open · Esc to close
        </div>
      </Modal>
    </div>
  );
}
