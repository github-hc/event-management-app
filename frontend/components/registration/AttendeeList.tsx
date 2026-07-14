"use client";
import { useState } from "react";
import { Registration } from "@/types/registration";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import { DATE_FORMAT_OPTIONS } from "@/lib/constants";

interface AttendeeListProps {
  registrations: Registration[];
  loading: boolean;
  onUnregister: (email: string) => Promise<void>;
}

function Avatar({ email }: { email: string }) {
  const initials = email.slice(0, 2).toUpperCase();
  const colors = [
    "#6366f1","#8b5cf6","#ec4899","#14b8a6","#f59e0b","#10b981","#3b82f6",
  ];
  const color = colors[email.charCodeAt(0) % colors.length];
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

export default function AttendeeList({ registrations, loading, onUnregister }: AttendeeListProps) {
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);

  async function handleUnregister(email: string) {
    setRemovingEmail(email);
    try {
      await onUnregister(email);
    } finally {
      setRemovingEmail(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <EmptyState
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M19 8v6M22 11h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        }
        title="No attendees yet"
        description="Be the first to register for this event."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {registrations.map((reg) => (
        <div
          key={reg.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-bright)] transition-colors group"
        >
          <Avatar email={reg.user_email} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {reg.user_email}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Registered {new Date(reg.registered_at).toLocaleString("en-US", DATE_FORMAT_OPTIONS)}
            </p>
          </div>
          <button
            onClick={() => handleUnregister(reg.user_email)}
            disabled={removingEmail === reg.user_email}
            className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-200 disabled:opacity-50"
          >
            {removingEmail === reg.user_email ? (
              <Spinner size="sm" />
            ) : (
              "Remove"
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
