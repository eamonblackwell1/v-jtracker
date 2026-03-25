-- Run in Supabase SQL Editor (same project as other dashboards).
--
-- 1) Jasmyn & Cam — set login password to: JasmynCam
-- 2) Frances & Joseph — new dashboard row (clone data from vanessa-jeremy).
--    Login password: FrancesJoseph
--
-- After insert: Vercel project with DEFAULT_SLUG=frances-joseph, same Supabase env vars.
--
-- If you already inserted slug "francis-joseph" (typo), run instead:
--   UPDATE public.dashboards
--   SET slug = 'frances-joseph',
--       couple_names = 'Frances & Joseph',
--       password_hash = '$2b$10$STXhbXMEcJcKlWZxReuz9exubL7GYWORSRSbNrGykjdd44itPTRm2'
--   WHERE slug = 'francis-joseph';

-- Password for Jasmyn & Cam
UPDATE public.dashboards
SET password_hash = '$2b$10$AcvSXcOOgtLS8YL89sx5puMveU7eOVeAekZjXR1j1Rkagb8czmZGG'
WHERE slug = 'jasmyn-cam';

-- Frances & Joseph (skip if row already exists — delete old row first or change slug)
INSERT INTO public.dashboards (slug, password_hash, couple_names, data)
SELECT
  'frances-joseph',
  '$2b$10$STXhbXMEcJcKlWZxReuz9exubL7GYWORSRSbNrGykjdd44itPTRm2'::text,
  'Frances & Joseph',
  data
FROM public.dashboards
WHERE slug = 'vanessa-jeremy'
LIMIT 1;
