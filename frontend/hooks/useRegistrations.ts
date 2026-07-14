"use client";
import { useState, useEffect, useCallback } from "react";
import { registrationService } from "@/services/registration.service";
import { Registration } from "@/types/registration";

export function useRegistrations(eventId: number) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await registrationService.getByEvent(eventId);
      setRegistrations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load registrations.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { fetchRegistrations(); }, [fetchRegistrations]);

  const register = async (email: string): Promise<Registration> => {
    const reg = await registrationService.register(eventId, { user_email: email });
    setRegistrations((prev) => [...prev, reg]);
    return reg;
  };

  const unregister = async (email: string): Promise<void> => {
    await registrationService.unregister(eventId, { user_email: email });
    setRegistrations((prev) => prev.filter((r) => r.user_email !== email));
  };

  return { registrations, loading, error, fetchRegistrations, register, unregister };
}
