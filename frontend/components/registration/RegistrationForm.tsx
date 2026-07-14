"use client";
import { useState } from "react";
import { Input } from "@/components/common/Input";
import Button from "@/components/common/Button";

interface RegistrationFormProps {
  onRegister: (email: string) => Promise<void>;
  isFull: boolean;
  isPast: boolean;
}

export default function RegistrationForm({ onRegister, isFull, isPast }: RegistrationFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    setSuccess(false);
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onRegister(email.trim());
      setSuccess(true);
      setEmail("");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  if (isPast) {
    return (
      <div className="px-4 py-3 rounded-lg bg-[var(--warning-bg)] border border-yellow-500/20 text-sm text-yellow-400">
        This event has already passed. Registration is closed.
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
        This event is at full capacity. No more registrations are available.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="register-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            error={error ?? undefined}
          />
        </div>
        <Button type="submit" loading={loading} className="shrink-0">
          Register
        </Button>
      </div>

      {apiError && (
        <p className="text-xs text-red-400">{apiError}</p>
      )}
      {success && (
        <p className="text-xs text-emerald-400">
          ✓ Successfully registered!
        </p>
      )}
    </form>
  );
}
