import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { Profile } from "@/types";
import { authService } from "@/services/auth.service";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  
  setSession: (session: Session | null) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  clearSession: () => void;
  initialize: () => () => void; // Returns unsubscribe function
}

const supabase = createClient();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  error: null,

  setSession: async (session) => {
    if (!session) {
      set({ session: null, user: null, profile: null, isLoading: false });
      return;
    }

    const user = session.user;
    
    // Set session immediately and unblock auth loading
    set({ session, user, isLoading: false, error: null });

    // Fetch profile in the background asynchronously
    if (!get().profile) {
      try {
        await get().fetchProfile(user.id);
      } catch (err: any) {
        console.error("Failed to load user profile in background:", err);
      }
    }
  },

  fetchProfile: async (userId) => {
    try {
      const profile = await authService.getUserProfile(userId);
      set({ profile });
    } catch (err: any) {
      set({ error: err.message || "Failed to load profile" });
    }
  },

  clearSession: () => {
    set({ user: null, profile: null, session: null, isLoading: false, error: null });
  },

  initialize: () => {
    // Only trigger loading state on cold loads if no session exists in memory
    if (!get().session) {
      set({ isLoading: true });
    }

    // Safety timeout: if Supabase hangs, force UI to unblock after 10 seconds
    const timeout = setTimeout(() => {
      if (get().isLoading) {
        console.warn("Auth initialization timed out, forcing UI unblock");
        set({ isLoading: false });
      }
    }, 10000);

    // 1. Get initial session
    supabase.auth.getSession().then((res: any) => {
      const session = res.data?.session || null;
      clearTimeout(timeout);
      get().setSession(session);
    }).catch((err: any) => {
      clearTimeout(timeout);
      set({ error: err.message || "Failed to get auth session", isLoading: false });
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: any, session: any) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          get().setSession(session);
        } else if (event === "SIGNED_OUT") {
          get().clearSession();
        }
      }
    );

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  },
}));
