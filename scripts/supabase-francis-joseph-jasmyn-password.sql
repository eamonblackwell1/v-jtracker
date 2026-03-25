-- Run in Supabase SQL Editor (same project as other dashboards).
--
-- 1) Jasmyn & Cam — set login password to: JasmynCam
-- 2) Francis & Joseph — new dashboard row (clone data from vanessa-jeremy).
--    Login password: FrancisJoseph
--
-- After insert: create a third Vercel project (or reuse pattern), set
-- DEFAULT_SLUG=francis-joseph, same Supabase env vars as other trackers.

-- Password for Jasmyn & Cam
UPDATE public.dashboards
SET password_hash = '$2b$10$AcvSXcOOgtLS8YL89sx5puMveU7eOVeAekZjXR1j1Rkagb8czmZGG'
WHERE slug = 'jasmyn-cam';

-- Francis & Joseph (skip if row already exists — delete old row first or change slug)
INSERT INTO public.dashboards (slug, password_hash, couple_names, data)
SELECT
  'francis-joseph',
  '$2b$10$7du4EUk3s6oouzxWaIgsr.YIW28WRtAKL.OpoBmwKzwLQtqAKaxIy'::text,
  'Francis & Joseph',
  data
FROM public.dashboards
WHERE slug = 'vanessa-jeremy'
LIMIT 1;
