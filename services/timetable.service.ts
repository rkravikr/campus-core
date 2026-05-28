import { createClient } from "@/lib/supabase/client";
import { TimetableEntry } from "@/types";

const supabase = createClient();

export interface TimetableEntryWithSubject extends TimetableEntry {
  subjects: {
    subject_name: string;
  } | null;
}

export const timetableService = {
  /**
   * Fetches the entire weekly timetable for the authenticated user, joining subject details.
   */
  async getTimetable(userId?: string, semester?: number): Promise<TimetableEntryWithSubject[]> {
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
      .from("timetable")
      .select("*, subjects(subject_name)")
      .eq("user_id", uId)
      .eq("semester", activeSem)
      .order("start_time", { ascending: true });

    if (error) throw error;
    return data as any[] as TimetableEntryWithSubject[];
  },

  /**
   * Creates a new class entry in the weekly timetable.
   */
  async addTimetableEntry(
    entry: Omit<TimetableEntry, "id" | "user_id" | "created_at" | "semester"> & { semester?: number }
  ): Promise<TimetableEntryWithSubject> {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) throw new Error("Unauthenticated");

    let activeSem = entry.semester;
    if (activeSem === undefined) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("semester")
        .eq("id", user.id)
        .single();
      activeSem = profile?.semester || 1;
    }

    const { data, error } = await supabase
      .from("timetable")
      .insert({
        user_id: user.id,
        subject_id: entry.subject_id,
        day: entry.day,
        start_time: entry.start_time,
        end_time: entry.end_time,
        room: entry.room,
        semester: activeSem,
      })
      .select("*, subjects(subject_name)")
      .single();

    if (error) throw error;
    return data as any as TimetableEntryWithSubject;
  },

  /**
   * Updates an existing timetable entry's properties.
   */
  async updateTimetableEntry(
    entryId: string,
    updates: Partial<Omit<TimetableEntry, "id" | "user_id" | "created_at">>
  ): Promise<TimetableEntryWithSubject> {
    const { data, error } = await supabase
      .from("timetable")
      .update(updates)
      .eq("id", entryId)
      .select("*, subjects(subject_name)")
      .single();

    if (error) throw error;
    return data as any as TimetableEntryWithSubject;
  },

  /**
   * Deletes a class from the timetable.
   */
  async deleteTimetableEntry(entryId: string): Promise<void> {
    const { error } = await supabase
      .from("timetable")
      .delete()
      .eq("id", entryId);

    if (error) throw error;
  },
};
