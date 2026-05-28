import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | undefined;
let activeSessionPromise: Promise<any> | null = null;

export function createClient() {
  if (typeof window === "undefined") {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
  }

  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );

    // Deduplicate concurrent getSession() calls to prevent navigator.locks deadlock / storage contention
    const originalGetSession = client.auth.getSession.bind(client.auth);
    client.auth.getSession = async () => {
      if (activeSessionPromise) {
        return activeSessionPromise;
      }
      activeSessionPromise = originalGetSession().finally(() => {
        activeSessionPromise = null;
      });
      return activeSessionPromise;
    };
  }

  return client;
}
