import { NextResponse } from "next/server";
import { getSupabase, getUser } from "@/lib/supabase/server";
import { allLessons, getCourse } from "@/lib/courses";

export async function POST(req: Request) {
  const { courseSlug, lessonId, done } = await req.json().catch(() => ({}));

  const course = getCourse(courseSlug);
  if (!course || !allLessons(course).some((l) => l.id === lessonId)) {
    return NextResponse.json({ error: "unknown lesson" }, { status: 400 });
  }

  const user = await getUser();
  const supabase = await getSupabase();
  if (!user || !supabase) return NextResponse.json({ error: "signed out" }, { status: 401 });

  // The RLS insert policy checks enrollment, so an unpaid student cannot write here.
  const { error } = done
    ? await supabase
        .from("lesson_progress")
        .upsert({ user_id: user.id, course_slug: courseSlug, lesson_id: lessonId })
    : await supabase
        .from("lesson_progress")
        .delete()
        .match({ user_id: user.id, course_slug: courseSlug, lesson_id: lessonId });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
