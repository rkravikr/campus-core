import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";

const supabase = createClient();

export const authService = {
  /**
   * Signs in a user using email and password.
   */
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Registers a new user with optional profile metadata (Name, College, Course).
   * User metadata will automatically be written to public.profiles via DB trigger.
   */
  async signUpWithEmail(
    email: string,
    password: string,
    metadata: {
      full_name: string;
      college_name: string;
      course: string;
      semester: number;
    }
  ) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.full_name,
          college_name: metadata.college_name,
          course: metadata.course,
          semester: metadata.semester,
        },
        // In local development or V1 we can let it redirect to dashboard
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Initiates the Google OAuth sign-in flow.
   */
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Signs out the current user session.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Fetches the user profile from the database public.profiles table.
   */
  async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // PostgREST single row not found
        return null;
      }
      throw error;
    }
    return data as Profile;
  },

  /**
   * Requests a password reset email for forgotten password flows.
   */
  async resetPasswordForEmail(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Updates an existing user profile in the database.
   */
  async updateProfile(
    userId: string,
    updates: Partial<Omit<Profile, "id" | "created_at">>
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },

  /**
   * Deletes the user account permanently by executing the security definer function.
   */
  async deleteAccount(): Promise<void> {
    const { error } = await supabase.rpc("delete_user_account");
    if (error) throw error;
  },
};
