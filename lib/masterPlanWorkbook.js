import fs from "node:fs";
import path from "node:path";
import * as xlsx from "xlsx";

const PHASE_OPTIONS = [
  "12+",
  "12-6",
  "6-3",
  "3-2",
  "2-1",
  "WEEKS",
  "POST",
];
xlsx.set_fs(fs);

export function loadMasterPlanChecklistFromWorkbook() {
  const workbookPath = path.join(process.cwd(), "vanessa_jeremy_tasks.xlsx");
  if (!fs.existsSync(workbookPath)) {
    return [];
  }

  const workbook = xlsx.readFile(workbookPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });

  let currentCategory = "General";
  const checklist = [];

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const [numRaw, phaseRaw, taskRaw, detailsRaw, timelineRaw, ownerRaw, statusRaw] = row;

    const numCell = String(numRaw || "").trim();
    const phaseCell = String(phaseRaw || "").trim();
    const taskCell = String(taskRaw || "").trim();
    const detailsCell = String(detailsRaw || "").trim();
    const timelineCell = String(timelineRaw || "").trim();
    const ownerCell = String(ownerRaw || "").trim();
    const statusCell = String(statusRaw || "").trim();

    // Category rows look like: ["", "", "STRATEGIC FOUNDATION", ...]
    if (!numCell && !phaseCell && taskCell && !detailsCell && !timelineCell && !ownerCell && !statusCell) {
      currentCategory = taskCell;
      continue;
    }

    if (!/^\d+$/.test(numCell)) continue;

    const num = Number(numCell);
    if (!taskCell) continue;

    checklist.push({
      id: `cl${num}`,
      num,
      phase: normalizePhase(phaseCell || timelineCell),
      category: currentCategory,
      task: taskCell,
      details: detailsCell,
      timeline: timelineCell,
      owner: normalizeOwner(ownerCell),
      status: normalizeStatus(statusCell),
      notes: [],
    });
  }

  return checklist
    .filter(item => PHASE_OPTIONS.includes(item.phase))
    .sort((a, b) => (a.num || 0) - (b.num || 0));
}

function normalizePhase(raw) {
  const key = String(raw || "").toLowerCase().replace(/\s+/g, "");
  if (key.includes("12+") || key.includes("12+months")) return "12+";
  if (key.includes("12-6") || key.includes("12–6")) return "12-6";
  if (key.includes("6-3") || key.includes("6–3")) return "6-3";
  if (key.includes("3-2") || key.includes("3–2")) return "3-2";
  if (key.includes("2-1") || key.includes("2–1")) return "2-1";
  if (key.includes("week") || key.includes("final")) return "WEEKS";
  if (key.includes("post")) return "POST";
  return "12+";
}

function normalizeOwner(raw) {
  const key = String(raw || "").toLowerCase().trim();
  if (key === "us" || key.includes("married in japan") || key === "mij") return "mij";
  if (key === "them" || key.includes("vanessa") || key.includes("jeremy")) return "vj";
  return "shared";
}

function normalizeStatus(raw) {
  const key = String(raw || "").toLowerCase().trim();
  if (key.includes("progress")) return "in-progress";
  if (key.includes("done") || key.includes("complete")) return "done";
  return "not-started";
}
