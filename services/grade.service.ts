import { createClient } from "@/lib/supabase/client";
import { Grade } from "@/types";

const supabase = createClient();

export const gradeService = {
  /**
   * Fetches all grade entries for the authenticated user.
   */
  async getGrades(userId?: string): Promise<Grade[]> {
    let uId = userId;
    if (!uId) {
      const { data: { session } } = await supabase.auth.getSession();
      uId = session?.user?.id;
    }
    if (!uId) throw new Error("Unauthenticated");

    const { data, error } = await supabase
      .from("grades")
      .select("*")
      .eq("user_id", uId)
      .order("semester", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Grade[];
  },

  /**
   * Creates a new grade entry.
   */
  async addGrade(
    grade: Omit<Grade, "id" | "user_id" | "created_at">
  ): Promise<Grade> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Unauthenticated");

    const { data, error } = await supabase
      .from("grades")
      .insert({
        user_id: user.id,
        semester: grade.semester,
        subject_name: grade.subject_name,
        credits: grade.credits,
        grade: grade.grade,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Grade;
  },

  /**
   * Updates an existing grade entry.
   */
  async updateGrade(
    gradeId: string,
    updates: Partial<Omit<Grade, "id" | "user_id" | "created_at">>
  ): Promise<Grade> {
    const { data, error } = await supabase
      .from("grades")
      .update(updates)
      .eq("id", gradeId)
      .select()
      .single();

    if (error) throw error;
    return data as Grade;
  },

  /**
   * Deletes a grade entry.
   */
  async deleteGrade(gradeId: string): Promise<void> {
    const { error } = await supabase
      .from("grades")
      .delete()
      .eq("id", gradeId);

    if (error) throw error;
  },
};
