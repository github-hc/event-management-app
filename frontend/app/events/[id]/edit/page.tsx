"use client";
import { use } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import EventForm from "@/components/event/EventForm";
import Spinner from "@/components/common/Spinner";
import { useEvent } from "@/hooks/useEvents";
import { eventService } from "@/services/event.service";
import { EventUpdate } from "@/types/event";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const { id } = use(params);
  const eventId = parseInt(id);
  const { event, loading, error } = useEvent(eventId);

  if (loading) {
    return (
      <PageContainer className="flex justify-center py-24">
        <Spinner size="lg" />
      </PageContainer>
    );
  }

  if (error || !event) {
    return (
      <PageContainer className="max-w-2xl">
        <div className="card p-10 text-center">
          <p className="text-[var(--text-secondary)] mb-4">{error ?? "Event not found."}</p>
          <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300">
            ← Back to Events
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--text-secondary)] transition-colors">Events</Link>
        <span>/</span>
        <Link href={`/events/${eventId}`} className="hover:text-[var(--text-secondary)] transition-colors truncate max-w-[150px]">
          {event.title}
        </Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)]">Edit</span>
      </div>

      <div className="card p-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Edit Event</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Update event details. Only changed fields will be saved.
          </p>
        </div>

        <EventForm
          initialValues={event}
          onSubmit={async (data) => {
            await eventService.update(eventId, data as EventUpdate);
          }}
          submitLabel="Save Changes"
          isEdit
        />
      </div>
    </PageContainer>
  );
}
