"use client";
import { useState, useEffect, useCallback } from "react";
import { eventService } from "@/services/event.service";
import { Event, EventCreate, EventUpdate } from "@/types/event";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const createEvent = async (payload: EventCreate): Promise<Event> => {
    const newEvent = await eventService.create(payload);
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = async (id: number, payload: EventUpdate): Promise<Event> => {
    const updated = await eventService.update(id, payload);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteEvent = async (id: number): Promise<void> => {
    await eventService.delete(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent };
}

export function useEvent(id: number) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getById(id);
      setEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load event.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);

  return { event, loading, error, refetch: fetchEvent };
}
