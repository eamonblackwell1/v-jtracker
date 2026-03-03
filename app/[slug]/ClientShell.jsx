"use client";
import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import PasswordGate from "@/components/PasswordGate";

export default function ClientShell({ slug, dashboardId, initialData }) {
  const [authed, setAuthed] = useState(null); // null = checking, true/false after check

  useEffect(() => {
    const token = localStorage.getItem(`mij_auth_${slug}`);
    setAuthed(!!token);
  }, [slug]);

  // Still checking localStorage — render nothing to avoid hydration flash
  if (authed === null) return null;

  if (!authed) {
    return <PasswordGate slug={slug} onSuccess={() => setAuthed(true)} />;
  }

  return <Dashboard initialData={initialData} dashboardId={dashboardId} />;
}
