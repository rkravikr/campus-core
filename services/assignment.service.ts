import { createClient } from "@/lib/supabase/client";
import { Assignment } from "@/types";

const supabase = createClient();

export interface AssignmentWithSubject extends Assignment {
  subjects: {
    subject_name: string;
  } | null;
}

export const assignmentService = {
  /**
   * Fetches all assignments for the authenticated user, joining the subject details.
   */
  async getAssignments(userId?: string, semester?: number): Promise<AssignmentWithSubject[]> {
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
      .from("assignments")
      .select("*, subjects(subject_name)")
      .eq("user_id", uId)
      .eq("semester", activeSem)
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data as any[] as AssignmentWithSubject[];
  },

  /**
   * Creates a new assignment.
   */
  async addAssignment(
    assignment: Omit<Assignment, "id" | "user_id" | "created_at" | "completed" | "semester"> & { semester?: number }
  ): Promise<AssignmentWithSubject> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Unauthenticated");

    let activeSem = assignment.semester;
    if (activeSem === undefined) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("semester")
        .eq("id", user.id)
        .single();
      activeSem = profile?.semester || 1;
    }

    const { data, error } = await supabase
      .from("assignments")
      .insert({
        user_id: user.id,
        subject_id: assignment.subject_id,
        title: assignment.title,
        description: assignment.description,
        due_date: assignment.due_date,
        priority: assignment.priority,
        completed: false,
        semester: activeSem,
      })
      .select("*, subjects(subject_name)")
      .single();

    if (error) throw error;
    return data as any as AssignmentWithSubject;
  },

  /**
   * Updates an existing assignment's properties.
   */
  async updateAssignment(
    assignmentId: string,
    updates: Partial<Omit<Assignment, "id" | "user_id" | "created_at">>
  ): Promise<AssignmentWithSubject> {
    const { data, error } = await supabase
      .from("assignments")
      .update(updates)
      .eq("id", assignmentId)
      .select("*, subjects(subject_name)")
      .single();

    if (error) throw error;
    return data as any as AssignmentWithSubject;
  },

  /**
   * Deletes an assignment.
   */
  async deleteAssignment(assignmentId: string): Promise<void> {
    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", assignmentId);

    if (error) throw error;
  },

  /**
   * Toggles assignment completion status.
   */
  async toggleAssignmentCompleted(
    assignmentId: string,
    completed: boolean
  ): Promise<AssignmentWithSubject> {
    return await this.updateAssignment(assignmentId, { completed });
  },
};
