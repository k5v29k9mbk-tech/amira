// TEMPORARY visual-check route. Deleted before hand-off.
import { setRequestLocale } from "next-intl/server";
import { CourseSelector } from "@/components/CourseSelector";

export default async function Preview({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="bg-ivory pt-32 pb-32">
      <CourseSelector />
    </main>
  );
}
