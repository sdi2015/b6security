import { useQuery } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type { Rider } from "./types";

const BASE_FIELDS =
  "id,account_id,full_name,discipline,email,phone,is_active,notes,created_at";

type RidersOptions = {
  includeInactive?: boolean;
};

export function isRlsError(error: PostgrestError | Error) {
  if (error instanceof Error && "code" in error) {
    const code = (error as PostgrestError).code;
    if (!code) {
      return false;
    }
    return code === "42501" || code === "PGRST302" || code === "PGRST301";
  }
  const message = (error as PostgrestError)?.message ?? error.message;
  return /permission denied/i.test(message ?? "");
}

export function useRiders(accountId?: string | null, options: RidersOptions = {}) {
  const { includeInactive = false } = options;
  return useQuery<Rider[], PostgrestError>({
    queryKey: ["riders", accountId, includeInactive],
    enabled: Boolean(accountId),
    retry(failureCount, error) {
      if (isRlsError(error)) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 30_000,
    queryFn: async () => {
      const query = supabase
        .from("riders")
        .select(BASE_FIELDS)
        .eq("account_id", accountId);

      if (!includeInactive) {
        query.eq("is_active", true);
      }

      const { data, error } = await query.order("full_name", { ascending: true });
      if (error) {
        throw error;
      }
      return data ?? [];
    },
  });
}

export function useRider(accountId?: string | null, riderId?: string | null) {
  return useQuery<Rider | null, PostgrestError>({
    queryKey: ["rider", accountId, riderId],
    enabled: Boolean(accountId && riderId),
    retry(failureCount, error) {
      if (isRlsError(error)) {
        return false;
      }
      return failureCount < 3;
    },
    queryFn: async () => {
      const { data, error } = await supabase
        .from("riders")
        .select(BASE_FIELDS)
        .eq("account_id", accountId)
        .eq("id", riderId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data ?? null;
    },
  });
}
