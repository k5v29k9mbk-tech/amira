import { getSupabase } from "@/lib/supabase/server";

export type Enrollment = {
  id: string;
  course_slug: string;
  created_at: string;
  completed_at: string | null;
};

export async function getEnrollments(): Promise<Enrollment[]> {
  const supabase = await getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("enrollments")
    .select("id, course_slug, created_at, completed_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getCompletedLessons(courseSlug?: string): Promise<Set<string>> {
  const supabase = await getSupabase();
  if (!supabase) return new Set();
  let query = supabase.from("lesson_progress").select("lesson_id");
  if (courseSlug) query = query.eq("course_slug", courseSlug);
  const { data } = await query;
  return new Set((data ?? []).map((r) => r.lesson_id as string));
}

/** Access gate for paid video. RLS already scopes the query to the current user. */
export async function isEnrolled(courseSlug: string): Promise<boolean> {
  const supabase = await getSupabase();
  if (!supabase) return false;
  const { data } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_slug", courseSlug)
    .maybeSingle();
  return Boolean(data);
}
