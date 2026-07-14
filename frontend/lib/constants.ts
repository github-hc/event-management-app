// Base API URL — backend running on port 8000
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Pagination
export const DEFAULT_PAGE_SIZE = 12;

// Date formatting
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

// Navigation links
export const NAV_LINKS = [
  { href: "/", label: "Events" },
  { href: "/events/create", label: "Create Event" },
];
