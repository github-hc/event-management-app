"use client";
import EventCard from "./EventCard";
import Spinner from "@/components/common/Spinner";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import Link from "next/link";
import { Event } from "@/types/event";

// Skeleton card while loading
function EventCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="skeleton h-5 w-20 rounded" />
      <div className="flex flex-col gap-2">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-2 rounded-full" />
      <div className="skeleton h-8 rounded-lg" />
    </div>
  );
}

interface EventListProps {
  events: Event[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
}

export default function EventList({ events, loading, error, onDelete }: EventListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5"/>
            <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-[var(--text-primary)] mb-1">Failed to load events</p>
          <p className="text-sm text-[var(--text-secondary)]">{error}</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="5" width="22" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 12h22" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 3v4M19 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        }
        title="No events yet"
        description="Get started by creating your first event. It only takes a minute."
        action={
          <Link href="/events/create">
            <Button>Create your first event</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onDelete={onDelete} />
      ))}
    </div>
  );
}
