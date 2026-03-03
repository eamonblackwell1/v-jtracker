import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";
import ClientShell from "./ClientShell";

export default async function DashboardPage({ params }) {
  const { slug } = await params;

  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("dashboards")
    .select("id, data")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  return <ClientShell slug={slug} dashboardId={data.id} initialData={data.data} />;
}
