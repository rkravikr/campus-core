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
    
    // Only block the UI and fetch if profile is not already in memory
    if (!get().profile) {
      set({ session, user, isLoading: true, error: null });
      try {
        await get().fetchProfile(user.id);
      } catch (err: any) {
        set({ error: err.message || "Failed to load profile", isLoading: false });
      }
    } else {
      set({ session, user, isLoading: false, error: null });
    }
  },

  fetchProfile: async (userId) => {
    try {
      const profile = await authService.getUserProfile(userId);
      set({ profile, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to load profile", isLoading: false });
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

    // Safety timeout: if Supabase hangs, force UI to unblock after 3 seconds
    const timeout = setTimeout(() => {
      if (get().isLoading) {
        console.warn("Auth initialization timed out, forcing UI unblock");
        set({ isLoading: false });
      }
    }, 3000);

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
      async (event: any, session: any) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await get().setSession(session);
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
