#!/usr/bin/env node
/**
 * Clone a dashboards row for a second couple (same Supabase project).
 *
 * Usage (from married-in-japan/):
 *   node scripts/duplicate-dashboard.mjs --from vanessa-jeremy --slug new-couple-slug --password "plain-password"
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment
 * (or in .env.local next to package.json).
 *
 * Vercel (second deployment) — manual checklist:
 * - New Vercel project → same GitHub repo and production branch as the first project.
 * - Copy all env vars from project 1 (Supabase URL, anon key, service role).
 * - Set DEFAULT_SLUG to the new slug (must match --slug above).
 * - Redeploy after changing env.
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(projectRoot, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

function parseArgs() {
  const argv = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--from") out.from = argv[++i];
    else if (a === "--slug") out.slug = argv[++i];
    else if (a === "--password") out.password = argv[++i];
  }
  return out;
}

loadEnvLocal();

const { from: sourceSlug, slug: newSlug, password } = parseArgs();

if (!sourceSlug || !newSlug || !password) {
  console.error(
    "Usage: node scripts/duplicate-dashboard.mjs --from <source-slug> --slug <new-slug> --password <plain>",
  );
  process.exit(1);
}

if (!/^[-a-z0-9]+$/i.test(newSlug)) {
  console.error("Slug should be URL-safe (letters, numbers, hyphens).");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (env or .env.local).",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const { data: row, error: fetchErr } = await supabase
  .from("dashboards")
  .select("data")
  .eq("slug", sourceSlug)
  .single();

if (fetchErr || !row) {
  console.error("Could not load source dashboard:", fetchErr?.message ?? fetchErr);
  process.exit(1);
}

const password_hash = await bcrypt.hash(password, 10);

const { data: existing } = await supabase
  .from("dashboards")
  .select("id")
  .eq("slug", newSlug)
  .maybeSingle();

if (existing) {
  console.error(`Slug "${newSlug}" already exists.`);
  process.exit(1);
}

const { error: insertErr } = await supabase.from("dashboards").insert({
  slug: newSlug,
  password_hash,
  data: row.data,
});

if (insertErr) {
  console.error("Insert failed:", insertErr.message);
  process.exit(1);
}

console.log(`Created dashboard slug "${newSlug}" (cloned data from "${sourceSlug}").`);
console.log(`Set DEFAULT_SLUG=${newSlug} on the second Vercel project and open / after deploy.`);
