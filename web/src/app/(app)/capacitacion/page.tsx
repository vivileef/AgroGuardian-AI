import { redirect } from "next/navigation";

/** Legacy path — encyclopedia lives at /enciclopedia */
export default async function CapacitacionRedirect({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { lesson } = await searchParams;
  const q = lesson ? `?lesson=${encodeURIComponent(lesson)}` : "";
  redirect(`/enciclopedia${q}`);
}
