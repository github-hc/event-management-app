"use client";
import { useState } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";

interface DeleteEventDialogProps {
  isOpen: boolean;
  eventTitle: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export default function DeleteEventDialog({
  isOpen,
  eventTitle,
  onConfirm,
  onClose,
}: DeleteEventDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Event">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-red-500/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 6v4M9 12h.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7.938 2.5L1.5 13.5A1.5 1.5 0 002.8 15.75h12.4a1.5 1.5 0 001.3-2.25L10.062 2.5a1.5 1.5 0 00-2.124 0z" stroke="#ef4444" strokeWidth="1.3"/>
            </svg>
          </div>
          <div>
            <p className="text-sm text-[var(--text-primary)] font-medium mb-1">
              Are you sure you want to delete{" "}
              <span className="text-[var(--text-primary)] font-semibold">&ldquo;{eventTitle}&rdquo;</span>?
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              This will also remove all attendee registrations. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="danger"
            loading={loading}
            onClick={handleConfirm}
            className="flex-1"
          >
            Delete Event
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
