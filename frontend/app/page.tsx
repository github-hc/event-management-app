"use client";
import { useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import EventList from "@/components/event/EventList";
import DeleteEventDialog from "@/components/event/DeleteEventDialog";
import Button from "@/components/common/Button";
import { useEvents } from "@/hooks/useEvents";
import { Event } from "@/types/event";

export default function HomePage() {
  const { events, loading, error, deleteEvent } = useEvents();
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);

  return (
    <PageContainer>
      {/* Background glow decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[100px] opacity-10"
          style={{ background: "radial-gradient(ellipse, #6366f1, #8b5cf6, transparent)" }}
        />
      </div>

      <div className="relative z-10">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Events Dashboard</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {loading ? "Loading events..." : `${events.length} event${events.length !== 1 ? "s" : ""} active`}
            </p>
          </div>
          <Link href="/events/create">
            <Button>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mr-1">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Create Event
            </Button>
          </Link>
        </div>

        <EventList
          events={events}
          loading={loading}
          error={error}
          onDelete={(id) => {
            const event = events.find((e) => e.id === id);
            if (event) setDeletingEvent(event);
          }}
        />

        <DeleteEventDialog
          isOpen={!!deletingEvent}
          eventTitle={deletingEvent?.title ?? ""}
          onConfirm={async () => {
            if (deletingEvent) await deleteEvent(deletingEvent.id);
          }}
          onClose={() => setDeletingEvent(null)}
        />
      </div>
    </PageContainer>
  );
}
