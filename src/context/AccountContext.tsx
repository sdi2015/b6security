import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { MOCK_ACCOUNT_ID } from "@/lib/mockData";

export type AccountRole =
  | "owner"
  | "manager"
  | "supervisor"
  | "guard"
  | "client"
  | "member"
  | "viewer"
  | null;

type AccountContextState = {
  accountId: string | null;
  role: AccountRole;
  status: "loading" | "ready" | "error";
  error?: string;
  refresh: () => Promise<void>;
};

const AccountContext = createContext<AccountContextState | undefined>(undefined);

async function fetchPrimaryMembership() {
  if (!isSupabaseConfigured) {
    return {
      accountId: MOCK_ACCOUNT_ID,
      role: "manager" as AccountRole,
    };
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const userId = session?.user?.id;
  if (!userId) {
    return { accountId: null, role: null };
  }

  const { data, error } = await supabase
    .from("account_members")
    .select("account_id, role")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return {
    accountId: data?.account_id ?? null,
    role: (data?.role as AccountRole) ?? null,
  };
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [role, setRole] = useState<AccountRole>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | undefined>();

  const load = useCallback(async () => {
    setStatus("loading");
    setError(undefined);
    try {
      const result = await fetchPrimaryMembership();
      setAccountId(result.accountId);
      setRole(result.role);
      setStatus("ready");
    } catch (err) {
      const message =
        (err as PostgrestError)?.message ??
        (err instanceof Error ? err.message : "Unable to load account context");
      console.error("Failed to load account context", err);
      setError(message);
      setAccountId(null);
      setRole(null);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
    if (!isSupabaseConfigured) {
      return () => {};
    }
    let subscription: ReturnType<typeof supabase.auth.onAuthStateChange> | null = null;
    try {
      subscription = supabase.auth.onAuthStateChange(() => {
        void load();
      });
    } catch (err) {
      const message =
        (err as PostgrestError)?.message ??
        (err instanceof Error ? err.message : "Unable to subscribe to auth changes");
      console.error("Failed to subscribe to auth changes", err);
      setError((current) => current ?? message);
      setStatus((current) => (current === "loading" ? "error" : current));
    }
    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [load]);

  const value = useMemo<AccountContextState>(
    () => ({ accountId, role, status, error, refresh: load }),
    [accountId, role, status, error, load]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
