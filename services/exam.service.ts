import { createClient } from "@/lib/supabase/client";
import { Exam } from "@/types";

const supabase = createClient();

export interface ExamWithSubject extends Exam {
  subjects: {
    subject_name: string;
  } | null;
}

export const examService = {
  /**
   * Fetches all upcoming exams for the authenticated user, joining the subject details.
   */
  /**
   * Fetches all upcoming exams for the authenticated user, joining the subject details.
   */
  async getExams(semester?: number): Promise<ExamWithSubject[]> {
    if (typeof window !== "undefined" && localStorage.getItem("campus_core_demo_session")) {
      const { getDemoExams } = await import("./demo.data");
      return getDemoExams(semester);
    }

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Unauthenticated");

    let activeSem = semester;
    if (activeSem === undefined) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("semester")
        .eq("id", user.id)
        .single();
      activeSem = profile?.semester || 1;
    }

    const { data, error } = await supabase
      .from("exams")
      .select("*, subjects(subject_name)")
      .eq("user_id", user.id)
      .eq("semester", activeSem)
      .order("exam_date", { ascending: true });

    if (error) throw error;
    return data as any[] as ExamWithSubject[];
  },

  /**
   * Creates a new exam entry.
   */
  async addExam(
    exam: Omit<Exam, "id" | "user_id" | "created_at" | "semester"> & { semester?: number }
  ): Promise<ExamWithSubject> {
    if (typeof window !== "undefined" && localStorage.getItem("campus_core_demo_session")) {
      const { addDemoExam } = await import("./demo.data");
      return addDemoExam(exam);
    }

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Unauthenticated");

    let activeSem = exam.semester;
    if (activeSem === undefined) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("semester")
        .eq("id", user.id)
        .single();
      activeSem = profile?.semester || 1;
    }

    const { data, error } = await supabase
      .from("exams")
      .insert({
        user_id: user.id,
        subject_id: exam.subject_id,
        exam_type: exam.exam_type,
        exam_date: exam.exam_date,
        semester: activeSem,
      })
      .select("*, subjects(subject_name)")
      .single();

    if (error) throw error;
    return data as any as ExamWithSubject;
  },

  /**
   * Updates an existing exam entry.
   */
  async updateExam(
    examId: string,
    updates: Partial<Omit<Exam, "id" | "user_id" | "created_at">>
  ): Promise<ExamWithSubject> {
    if (examId.startsWith("exam-")) {
      const { updateDemoExam } = await import("./demo.data");
      return updateDemoExam(examId, updates);
    }

    const { data, error } = await supabase
      .from("exams")
      .update(updates)
      .eq("id", examId)
      .select("*, subjects(subject_name)")
      .single();

    if (error) throw error;
    return data as any as ExamWithSubject;
  },

  /**
   * Deletes an exam entry.
   */
  async deleteExam(examId: string): Promise<void> {
    if (examId.startsWith("exam-")) {
      const { deleteDemoExam } = await import("./demo.data");
      return deleteDemoExam(examId);
    }

    const { error } = await supabase
      .from("exams")
      .delete()
      .eq("id", examId);

    if (error) throw error;
  },
};
