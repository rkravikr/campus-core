import { createClient } from "@/lib/supabase/client";
import { Subject } from "@/types";

const supabase = createClient();

export const attendanceService = {
  /**
   * Fetches all subjects for the authenticated user.
   */
  async getSubjects(userId?: string, semester?: number): Promise<Subject[]> {
    let uId = userId;
    if (!uId) {
      const { data: { session } } = await supabase.auth.getSession();
      uId = session?.user?.id;
    }
    if (!uId) throw new Error("Unauthenticated");

    let activeSem = semester;
    if (activeSem === undefined) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("semester")
        .eq("id", uId)
        .single();
      activeSem = profile?.semester || 1;
    }

    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", uId)
      .eq("semester", activeSem)
      .order("subject_name", { ascending: true });

    if (error) throw error;
    return data as Subject[];
  },

  /**
   * Adds a new subject to track.
   */
  async addSubject(subjectName: string, semester?: number): Promise<Subject> {
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
      .from("subjects")
      .insert({
        user_id: user.id,
        subject_name: subjectName,
        total_classes: 0,
        attended_classes: 0,
        semester: activeSem,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Subject;
  },

  /**
   * Updates an existing subject's class counts.
   */
  async updateSubject(
    subjectId: string,
    updates: Partial<Pick<Subject, "subject_name" | "total_classes" | "attended_classes">>
  ): Promise<Subject> {
    const { data, error } = await supabase
      .from("subjects")
      .update(updates)
      .eq("id", subjectId)
      .select()
      .single();

    if (error) throw error;
    return data as Subject;
  },

  /**
   * Deletes a subject and cascades related items.
   */
  async deleteSubject(subjectId: string): Promise<void> {
    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", subjectId);

    if (error) throw error;
  },

  /**
   * Increments class counts.
   * - 'attended': Increments BOTH attended and total classes (Student attended the lecture)
   * - 'missed': Increments ONLY total classes (Student bunked the lecture)
   */
  async logAttendance(
    subjectId: string,
    type: "attended" | "missed"
  ): Promise<Subject> {
    // 1. Fetch current counts
    const { data: subject, error: fetchErr } = await supabase
      .from("subjects")
      .select("total_classes, attended_classes")
      .eq("id", subjectId)
      .single();

    if (fetchErr) throw fetchErr;

    const updates = {
      total_classes: subject.total_classes + 1,
      attended_classes: type === "attended" ? subject.attended_classes + 1 : subject.attended_classes,
    };

    // 2. Perform update
    return await this.updateSubject(subjectId, updates);
  },

  /**
   * Reverts class logs by decrementing.
   * Prevent values from falling below zero.
   */
  async revertAttendance(
    subjectId: string,
    type: "attended" | "missed"
  ): Promise<Subject> {
    const { data: subject, error: fetchErr } = await supabase
      .from("subjects")
      .select("total_classes, attended_classes")
      .eq("id", subjectId)
      .single();

    if (fetchErr) throw fetchErr;

    if (subject.total_classes === 0) return subject as Subject;

    const updates = {
      total_classes: Math.max(0, subject.total_classes - 1),
      attended_classes: 
        type === "attended" 
          ? Math.max(0, subject.attended_classes - 1) 
          : Math.max(0, Math.min(subject.total_classes - 1, subject.attended_classes)),
    };

    return await this.updateSubject(subjectId, updates);
  },
};
