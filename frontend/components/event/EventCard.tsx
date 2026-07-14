"use client";
import Link from "next/link";
import { Event } from "@/types/event";
import { DATE_FORMAT_OPTIONS } from "@/lib/constants";

interface EventCardProps {
  event: Event;
  onDelete?: (id: number) => void;
}

function CapacityBar({ registered, max }: { registered: number; max: number }) {
  const pct = Math.min((registered / max) * 100, 100);
  const color = pct >= 100 ? "#ef4444" : pct >= 80 ? "#f59e0b" : "#10b981";
  return (
    <div>
      <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
        <span>{registered} registered</span>
        <span>{max - registered} spots left</span>
      </div>
      <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const isPast = new Date(event.date) < new Date();
  const isFull = event.available_spots === 0;
  const formattedDate = new Date(event.date).toLocaleString("en-US", DATE_FORMAT_OPTIONS);

  return (
    <div className="card card-interactive flex flex-col h-full animate-fade-in">
      {/* Top accent bar */}
      <div
        className="h-1 w-full rounded-t-[11px]"
        style={{
          background: isPast
            ? "var(--text-muted)"
            : isFull
            ? "linear-gradient(90deg, #ef4444, #f59e0b)"
            : "linear-gradient(90deg, #6366f1, #8b5cf6)",
        }}
      />

      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Status badge */}
        <div className="flex items-center justify-between gap-2">
          {isPast ? (
            <span className="badge badge-warning">Past</span>
          ) : isFull ? (
            <span className="badge badge-danger">Full</span>
          ) : (
            <span className="badge badge-success">Open</span>
          )}
          <span className="text-xs text-[var(--text-muted)]">#{event.id}</span>
        </div>

        {/* Title & description */}
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--text-primary)] text-base leading-snug mb-1.5 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2.5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M1 6h12" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M4.5 1.5v2M9.5 1.5v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span className={isPast ? "text-[var(--warning)]" : ""}>{formattedDate}</span>
        </div>

        {/* Capacity bar */}
        <CapacityBar registered={event.registered_count} max={event.max_capacity} />

        {/* Divider */}
        <div className="divider" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/events/${event.id}`}
            className="flex-1 text-center py-2 rounded-lg text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200"
          >
            Register / Details
          </Link>
          <Link
            href={`/events/${event.id}/edit`}
            className="py-2 px-3 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-white/5 hover:bg-white/10 border border-[var(--border)] transition-all duration-200"
          >
            Edit
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(event.id)}
              className="py-2 px-3 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-200"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
