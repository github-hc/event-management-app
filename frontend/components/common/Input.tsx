"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const baseInputClass = `
  w-full px-3.5 py-2.5 rounded-lg text-sm text-[var(--text-primary)]
  bg-[var(--surface)] border border-[var(--border)]
  placeholder-[var(--text-muted)]
  focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
`;

export function Input({ label, error, hint, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`${baseInputClass} ${error ? "border-red-500 focus:ring-red-500/30" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, error, hint, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        rows={4}
        className={`${baseInputClass} resize-none ${error ? "border-red-500 focus:ring-red-500/30" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

export default Input;
