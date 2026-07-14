"use client";
import PageContainer from "@/components/layout/PageContainer";
import EventForm from "@/components/event/EventForm";
import { useEvents } from "@/hooks/useEvents";
import { EventCreate } from "@/types/event";
import Link from "next/link";

export default function CreateEventPage() {
  const { createEvent } = useEvents();

  return (
    <PageContainer className="max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--text-secondary)] transition-colors">
          Events
        </Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">Create</span>
      </div>

      <div className="card p-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Create New Event</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Fill in the details below. The event date must be in the future.
          </p>
        </div>

        <EventForm
          onSubmit={async (data) => {
            await createEvent(data as EventCreate);
          }}
          submitLabel="Create Event"
        />
      </div>
    </PageContainer>
  );
}
