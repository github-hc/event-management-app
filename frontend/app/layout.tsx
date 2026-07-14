import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: { default: "EventFlow", template: "%s | EventFlow" },
  description: "Manage events and attendee registrations with ease.",
  keywords: ["events", "registration", "management"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-[var(--border)] py-5 text-center text-xs text-[var(--text-muted)]">
          EventFlow — Event Management System
        </footer>
      </body>
    </html>
  );
}
