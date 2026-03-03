"use client";
import { useEffect, useRef } from "react";
import { getSupabase } from "@/lib/supabase";

export function useDebouncedSave(data, dashboardId, setSaveStatus, onSaveSuccess, delay = 500) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip saving on initial mount — data came from the server, no need to write it back
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!dashboardId) return;

    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        const supabase = getSupabase();
        const { error } = await supabase
          .from("dashboards")
          .update({ data })
          .eq("id", dashboardId);

        if (error) {
          console.error("Save failed:", error);
          setSaveStatus("idle");
        } else {
          setSaveStatus("saved");
          if (onSaveSuccess) onSaveSuccess();
        }
      } catch (err) {
        console.error("Save error:", err);
        setSaveStatus("idle");
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps
}
