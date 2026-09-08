export { cn } from "cn";

import { format, formatDistanceToNow } from "date-fns";

// Format a date for display (e.g. "Sep 8, 2026")
export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

// Format a date with time (e.g. "Sep 8, 2026 at 9:41 PM")
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
}

// Relative time (e.g. "3 days ago")
export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Format a currency amount
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

// Truncate a string with an ellipsis
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

// Generate initials from a full name (for avatar fallback)
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
