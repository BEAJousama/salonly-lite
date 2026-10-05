"use client";
import { cn } from "@/lib/format";
import { statusMeta } from "@/lib/status";
import * as Dialog from "@radix-ui/react-dialog";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  MoreHorizontal,
  Scissors,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
export function Button({
  children,
  variant = "default",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost" | "danger";
}) {
  return (
    <button
      type="button"
      className={cn("btn", `btn-${variant}`, className)}
      {...props}
    >
      {children}
    </button>
  );
}
export function LinkButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link href={href} className={cn("btn", primary && "btn-primary")}>
      {children}
    </Link>
  );
}
export function IconButton({
  label,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      className="icon-button"
      title={label}
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  );
}
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/dashboard" aria-label="Salonly dashboard">
      <span className="brand-icon">
        <Scissors size={23} />
      </span>
      {!compact && (
        <span>
          salonly<span className="brand-dot">.</span>
        </span>
      )}
    </Link>
  );
}
export function Avatar({
  name,
  size = "md",
  color,
}: {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
}) {
  const tones = ["clay", "sage", "mauve", "sand", "slate"];
  return (
    <span
      className={cn(
        "avatar",
        `avatar-${size}`,
        `tone-${color ?? tones[name.length % 5]}`,
      )}
      aria-hidden="true"
    >
      {name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
export function Person({
  name,
  detail,
  href,
  color,
}: {
  name: string;
  detail?: string;
  href?: string;
  color?: string;
}) {
  const body = (
    <>
      <Avatar name={name} color={color} />
      <span>
        <strong>{name}</strong>
        {detail && <small>{detail}</small>}
      </span>
    </>
  );
  return href ? (
    <Link className="person" href={href}>
      {body}
    </Link>
  ) : (
    <div className="person">{body}</div>
  );
}
export function Badge({ status }: { status: string }) {
  const meta = statusMeta(status);
  return (
    <span className={`badge badge-${meta.tone}`}>
      <span />
      {meta.label}
    </span>
  );
}
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}
export function Card({
  title,
  subtitle,
  action,
  children,
  className,
  flush = false,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <section className={cn("card", className)}>
      {title && (
        <div className="card-heading">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={flush ? "" : "card-body"}>{children}</div>
    </section>
  );
}
export function Metric({
  label,
  value,
  change,
  detail,
  icon,
}: {
  label: string;
  value: string;
  change?: string;
  detail?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="metric">
      <div className="metric-label">
        {label}
        {icon}
      </div>
      <div className="metric-value">
        {value}
        <span className="mini-trend">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="metric-caption">
        {change && (
          <span>
            <ArrowUpRight size={12} />
            {change}
          </span>
        )}
        {detail ?? "vs. previous period"}
      </div>
    </div>
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Search records…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-input">
      <Search size={16} />
      <input
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <IconButton label="Clear search" onClick={() => onChange("")}>
          <X size={14} />
        </IconButton>
      )}
    </div>
  );
}
export function Tabs({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((item, i) => (
        <button
          key={item}
          role="tab"
          aria-selected={value === item}
          tabIndex={value === item ? 0 : -1}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              const next =
                (i + (e.key === "ArrowRight" ? 1 : -1) + items.length) %
                items.length;
              onChange(items[next]);
              (
                e.currentTarget.parentElement?.children[next] as HTMLElement
              )?.focus();
            }
          }}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
export function Modal({
  open,
  onClose,
  title,
  description = "Manage your studio details.",
  children,
  drawer = false,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  drawer?: boolean;
  wide?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          className={cn("modal", drawer && "drawer", wide && "modal-wide")}
        >
          <header className="modal-heading">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>{description}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="icon-button" aria-label="Close dialog">
                <X size={19} />
              </button>
            </Dialog.Close>
          </header>
          <div className="modal-body">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function Menu({
  label = "More options",
  children,
  items,
}: {
  label?: string;
  children?: ReactNode;
  items: { label: string; onClick: () => void; danger?: boolean }[];
}) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button className={children ? "btn" : "icon-button"} aria-label={label}>
          {children ?? <MoreHorizontal size={18} />}
        </button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content className="dropdown" sideOffset={8} align="end">
          {items.map((i) => (
            <Dropdown.Item
              className={cn("dropdown-item", i.danger && "text-danger")}
              key={i.label}
              onSelect={i.onClick}
            >
              {i.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
export function EmptyState({
  title = "No matching records",
  description = "Try another search or adjust your filters.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Search size={26} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Field({
  label,
  children,
  error,
  hint,
}: {
  label: string;
  children: ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && (
        <small className="text-danger" role="alert">
          {error}
        </small>
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label ?? "Progress"}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
    </div>
  );
}
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      className={cn("switch", checked && "on")}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span>{checked && <Check size={10} />}</span>
    </button>
  );
}
export function ViewAll({
  href,
  label = "View all",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link className="text-link" href={href}>
      {label}
      <ChevronRight size={14} />
    </Link>
  );
}
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      <div className="actions end">
        <Button onClick={onClose}>Keep record</Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
export function LoadingSkeleton() {
  return (
    <div className="skeleton-page" aria-busy="true" aria-label="Loading studio">
      <div className="skeleton title" />
      <div className="metrics">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton metric" />
        ))}
      </div>
      <div className="skeleton panel" />
      <div className="skeleton panel" />
    </div>
  );
}
