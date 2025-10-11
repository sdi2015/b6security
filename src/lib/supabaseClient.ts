import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are missing. Data queries will fail until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured."
  );
}

const fallbackClient: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    if (property === "auth") {
      return new Proxy(
        {},
        {
          get() {
            throw new Error(
              "Supabase client is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable data access."
            );
          },
        }
      );
    }
    throw new Error(
      "Supabase client is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable data access."
    );
  },
});

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : fallbackClient;
