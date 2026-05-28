import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";

const supabase = createClient();

export const authService = {
  /**
   * Signs in a user using email and password.
   */
  async signInWithEmail(email: string, password: string) {
    if (email.toLowerCase().trim() === "demo@campuscore.app") {
      if (password !== "demo1234") {
        throw new Error("Invalid credentials for demo account");
      }

      const { seedDemoData, DEMO_USER_ID } = await import("./demo.data");
      seedDemoData(true); // Always force seed initial dashboard state on direct demo logins

      const mockSession = {
        access_token: "demo-jwt-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "demo-refresh-token",
        user: {
          id: DEMO_USER_ID,
          aud: "authenticated",
          role: "authenticated",
          email: "demo@campuscore.app",
          email_confirmed_at: new Date().toISOString(),
          phone: "",
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: { provider: "email", providers: ["email"] },
          user_metadata: {
            full_name: "Alex Mercer",
            college_name: "Tech Institute of Technology",
            course: "Computer Science & Engineering",
            semester: 5,
          },
          identities: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("campus_core_demo_session", JSON.stringify(mockSession));
        // Set a cookie so the server-side middleware can detect the demo session
        // and skip the Supabase auth check (localStorage is client-only)
        document.cookie = "campus_core_demo=true; path=/; max-age=3600; SameSite=Lax";
      }

      return { data: { session: mockSession as any, user: mockSession.user as any }, error: null };
    }

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
    const { data, error } = await supabase.signInWithOAuth({
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
    if (typeof window !== "undefined" && localStorage.getItem("campus_core_demo_session")) {
      const { clearDemoData } = await import("./demo.data");
      clearDemoData();
      // Clear the demo cookie so middleware stops bypassing auth
      document.cookie = "campus_core_demo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Fetches the user profile from the database public.profiles table.
   */
  async getUserProfile(userId: string): Promise<Profile | null> {
    if (userId === "demo-user-id") {
      const { getDemoProfile } = await import("./demo.data");
      return getDemoProfile();
    }

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
    if (userId === "demo-user-id") {
      const { updateDemoProfile } = await import("./demo.data");
      return updateDemoProfile(updates);
    }

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
    if (typeof window !== "undefined" && localStorage.getItem("campus_core_demo_session")) {
      const { clearDemoData } = await import("./demo.data");
      clearDemoData();
      document.cookie = "campus_core_demo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      return;
    }
    const { error } = await supabase.rpc("delete_user_account");
    if (error) throw error;
  },

  /**
   * Uploads a profile avatar to Supabase Storage.
   * Files are stored at `avatars/{userId}/avatar.{ext}` and upserted on re-upload.
   * Returns the public URL of the uploaded avatar.
   */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    // Demo sandbox: convert to base64 and store in localStorage
    if (userId === "demo-user-id") {
      const { setDemoAvatar } = await import("./demo.data");
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setDemoAvatar(base64);
          resolve(base64);
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Append cache-buster to force browser to re-fetch after update
    return `${urlData.publicUrl}?t=${Date.now()}`;
  },

  /**
   * Returns the public URL for a given avatar storage path.
   */
  getAvatarUrl(path: string): string {
    if (path.startsWith("data:")) return path; // Demo base64 data URL
    if (path.startsWith("http")) return path;  // Already a full URL
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl;
  },
};
