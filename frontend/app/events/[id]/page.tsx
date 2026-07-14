"use client";
import { use } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import RegistrationForm from "@/components/registration/RegistrationForm";
import AttendeeList from "@/components/registration/AttendeeList";
import Spinner from "@/components/common/Spinner";
import Button from "@/components/common/Button";
import { useEvent } from "@/hooks/useEvents";
import { useRegistrations } from "@/hooks/useRegistrations";
import { DATE_FORMAT_OPTIONS } from "@/lib/constants";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = use(params);
  const eventId = parseInt(id);
  const { event, loading: eventLoading, error: eventError, refetch } = useEvent(eventId);
  const { registrations, loading: regLoading, register, unregister } = useRegistrations(eventId);

  const isPast = event ? new Date(event.date) < new Date() : false;
  const isFull = event ? event.available_spots === 0 : false;

  if (eventLoading) {
    return (
      <PageContainer className="flex justify-center py-24">
        <Spinner size="lg" />
      </PageContainer>
    );
  }

  if (eventError || !event) {
    return (
      <PageContainer className="max-w-2xl">
        <div className="card p-10 text-center">
          <p className="text-[var(--text-secondary)] mb-4">{eventError ?? "Event not found."}</p>
          <Link href="/">
            <Button variant="secondary">← Back to Events</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--text-secondary)] transition-colors">Events</Link>
        <span>/</span>
        <span className="text-[var(--text-secondary)] truncate max-w-[200px]">{event.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Event details */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="card p-6">
            {/* Status + actions */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                {isPast ? (
                  <span className="badge badge-warning">Past Event</span>
                ) : isFull ? (
                  <span className="badge badge-danger">Full</span>
                ) : (
                  <span className="badge badge-success">Open</span>
                )}
                <span className="badge badge-accent">#{event.id}</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/events/${event.id}/edit`}>
                  <Button variant="secondary" size="sm">Edit</Button>
                </Link>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3 leading-tight">
              {event.title}
            </h1>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
              {event.description}
            </p>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Date & Time</span>
                <span className={`text-sm font-medium ${isPast ? "text-yellow-400" : "text-[var(--text-primary)]"}`}>
                  {new Date(event.date).toLocaleString("en-US", DATE_FORMAT_OPTIONS)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Capacity</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {event.registered_count} / {event.max_capacity} registered
                </span>
              </div>
            </div>

            {/* Capacity bar */}
            <div className="mt-5">
              <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((event.registered_count / event.max_capacity) * 100, 100)}%`,
                    background: isFull
                      ? "#ef4444"
                      : event.registered_count / event.max_capacity >= 0.8
                      ? "#f59e0b"
                      : "linear-gradient(90deg, #6366f1, #8b5cf6)",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
                <span>{event.available_spots} spots available</span>
                <span>{Math.round((event.registered_count / event.max_capacity) * 100)}% full</span>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Attendees
                <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">
                  ({registrations.length})
                </span>
              </h2>
              <button
                onClick={refetch}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                Refresh
              </button>
            </div>
            <AttendeeList
              registrations={registrations}
              loading={regLoading}
              onUnregister={unregister}
            />
          </div>
        </div>

        {/* Right: Registration */}
        <div className="flex flex-col gap-5">
          <div className="card p-5 sticky top-24">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Register</h2>
            <RegistrationForm
              onRegister={async (email) => {
                await register(email);
                await refetch();
              }}
              isFull={isFull}
              isPast={isPast}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
