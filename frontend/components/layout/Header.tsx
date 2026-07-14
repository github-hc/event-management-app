"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--border)]"
      style={{ background: "rgba(5, 8, 22, 0.85)", backdropFilter: "blur(16px)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40 transition-transform group-hover:scale-105">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="11" rx="2" stroke="white" strokeWidth="1.4"/>
              <path d="M2 7h12" stroke="white" strokeWidth="1.4"/>
              <path d="M5 2v2M11 2v2" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              <rect x="5" y="9" width="2" height="2" rx="0.5" fill="white"/>
              <rect x="9" y="9" width="2" height="2" rx="0.5" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-[var(--text-primary)] tracking-tight">EventFlow</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
