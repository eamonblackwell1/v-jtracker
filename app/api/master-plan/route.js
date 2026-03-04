import { NextResponse } from "next/server";
import { loadMasterPlanChecklistFromWorkbook } from "@/lib/masterPlanWorkbook";

export async function GET() {
  try {
    const checklist = loadMasterPlanChecklistFromWorkbook();
    return NextResponse.json({ checklist });
  } catch (err) {
    console.error("Master plan load error:", err);
    return NextResponse.json({ error: "Failed to load master plan workbook" }, { status: 500 });
  }
}
