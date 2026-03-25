import { redirect } from "next/navigation";

const FALLBACK_SLUG = "vanessa-jeremy";

export default function Home() {
  const raw = process.env.DEFAULT_SLUG?.trim();
  const slug = raw || FALLBACK_SLUG;
  redirect(`/${slug}`);
}
