"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/common/Input";
import Button from "@/components/common/Button";
import { EventCreate, EventUpdate, Event } from "@/types/event";

interface EventFormProps {
  initialValues?: Partial<Event>;
  onSubmit: (data: EventCreate | EventUpdate) => Promise<void>;
  submitLabel?: string;
  isEdit?: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  date?: string;
  max_capacity?: string;
}

// Convert a stored ISO date to a local datetime-local input value
function toDatetimeLocal(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventForm({
  initialValues,
  onSubmit,
  submitLabel = "Create Event",
  isEdit = false,
}: EventFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [date, setDate] = useState(
    initialValues?.date ? toDatetimeLocal(initialValues.date) : ""
  );
  const [maxCapacity, setMaxCapacity] = useState(
    initialValues?.max_capacity?.toString() ?? ""
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!date) {
      newErrors.date = "Date is required.";
    } else if (new Date(date) <= new Date()) {
      newErrors.date = "Event date must be in the future.";
    }
    const cap = parseInt(maxCapacity);
    if (!maxCapacity || isNaN(cap) || cap < 1) {
      newErrors.max_capacity = "Capacity must be at least 1.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        date: new Date(date).toISOString(),
        max_capacity: parseInt(maxCapacity),
      });
      router.push("/");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="event-title"
        label="Event Title"
        placeholder="e.g. Tech Conference 2027"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />

      <Textarea
        id="event-description"
        label="Description"
        placeholder="Describe what attendees can expect..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="event-date"
          label="Date & Time"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />
        <Input
          id="event-capacity"
          label="Max Capacity"
          type="number"
          min={1}
          placeholder="e.g. 200"
          value={maxCapacity}
          onChange={(e) => setMaxCapacity(e.target.value)}
          error={errors.max_capacity}
        />
      </div>

      {apiError && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {apiError}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={submitting} className="flex-1">
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
