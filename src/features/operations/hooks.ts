import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type {
  ClientAccount,
  DashboardMetrics,
  Guard,
  IncidentReport,
  OperationsReport,
  ShiftAssignment,
  Site,
} from "./types";

function isPermissionError(error: PostgrestError | Error) {
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

const GUARD_FIELDS =
  "id,account_id,badge_number,first_name,last_name,email,phone,status,shift_preference,primary_site_id,hire_date,certifications,avatar_url,created_at,updated_at";

export function useGuards(accountId?: string | null, includeInactive = false) {
  return useQuery<Guard[], PostgrestError>({
    queryKey: ["guards", accountId, includeInactive],
    enabled: Boolean(accountId),
    retry(failureCount, error) {
      if (isPermissionError(error)) {
        return false;
      }
      return failureCount < 3;
    },
    queryFn: async () => {
      const query = supabase
        .from("guards")
        .select(GUARD_FIELDS)
        .eq("account_id", accountId)
        .order("last_name", { ascending: true })
        .order("first_name", { ascending: true });

      if (!includeInactive) {
        query.eq("status", "active");
      }

      const { data, error } = await query;
      if (error) {
        throw error;
      }
      return data ?? [];
    },
  });
}

const CLIENT_FIELDS =
  "id,account_id,name,contact_name,contact_email,contact_phone,status,created_at,updated_at";

export function useClients(accountId?: string | null) {
  return useQuery<ClientAccount[], PostgrestError>({
    queryKey: ["clients", accountId],
    enabled: Boolean(accountId),
    retry(failureCount, error) {
      if (isPermissionError(error)) {
        return false;
      }
      return failureCount < 3;
    },
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select(CLIENT_FIELDS)
        .eq("account_id", accountId)
        .order("name", { ascending: true });
      if (error) {
        throw error;
      }
      return data ?? [];
    },
  });
}

const SITE_FIELDS =
  "id,account_id,client_id,name,address_line1,address_line2,city,state,postal_code,timezone,is_active,created_at,updated_at";

export function useSites(accountId?: string | null, includeInactive = false) {
  return useQuery<Site[], PostgrestError>({
    queryKey: ["sites", accountId, includeInactive],
    enabled: Boolean(accountId),
    retry(failureCount, error) {
      if (isPermissionError(error)) {
        return false;
      }
      return failureCount < 3;
    },
    queryFn: async () => {
      const query = supabase
        .from("sites")
        .select(SITE_FIELDS)
        .eq("account_id", accountId)
        .order("name", { ascending: true });
      if (!includeInactive) {
        query.eq("is_active", true);
      }
      const { data, error } = await query;
      if (error) {
        throw error;
      }
      return data ?? [];
    },
  });
}

const SHIFT_FIELDS =
  "id,account_id,site_id,guard_id,start_time,end_time,status,notes,created_at,updated_at,site:sites(id,name,timezone),guard:guards(id,first_name,last_name,badge_number)";

export function useUpcomingShifts(accountId?: string | null, daysAhead = 14) {
  return useQuery<ShiftAssignment[], PostgrestError>({
    queryKey: ["shifts", accountId, daysAhead],
    enabled: Boolean(accountId),
    retry(failureCount, error) {
      if (isPermissionError(error)) {
        return false;
      }
      return failureCount < 3;
    },
    queryFn: async () => {
      const now = new Date();
      const end = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
      const { data, error } = await supabase
        .from("shifts")
        .select(SHIFT_FIELDS)
        .eq("account_id", accountId)
        .gte("end_time", now.toISOString())
        .lte("start_time", end.toISOString())
        .order("start_time", { ascending: true });
      if (error) {
        throw error;
      }
      return data ?? [];
    },
  });
}

const INCIDENT_FIELDS =
  "id,account_id,site_id,guard_id,shift_id,occurred_at,type,summary,status,severity,follow_up_due_at,created_at,updated_at,site:sites(id,name),guard:guards(id,first_name,last_name)";

export function useIncidents(accountId?: string | null, statusFilter?: string) {
  return useQuery<IncidentReport[], PostgrestError>({
    queryKey: ["incidents", accountId, statusFilter],
    enabled: Boolean(accountId),
    retry(failureCount, error) {
      if (isPermissionError(error)) {
        return false;
      }
      return failureCount < 3;
    },
    queryFn: async () => {
      const query = supabase
        .from("incidents")
        .select(INCIDENT_FIELDS)
        .eq("account_id", accountId)
        .order("occurred_at", { ascending: false });

      if (statusFilter) {
        query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) {
        throw error;
      }
      return data ?? [];
    },
  });
}

const REPORT_FIELDS =
  "id,account_id,site_id,guard_id,shift_id,report_type,submitted_at,title,body,created_at,updated_at";

export function useReports(accountId?: string | null) {
  return useQuery<OperationsReport[], PostgrestError>({
    queryKey: ["reports", accountId],
    enabled: Boolean(accountId),
    retry(failureCount, error) {
      if (isPermissionError(error)) {
        return false;
      }
      return failureCount < 3;
    },
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select(REPORT_FIELDS)
        .eq("account_id", accountId)
        .order("submitted_at", { ascending: false });
      if (error) {
        throw error;
      }
      return data ?? [];
    },
  });
}

export function useDashboardMetrics(accountId?: string | null) {
  return useQuery<DashboardMetrics, PostgrestError>({
    queryKey: ["dashboard_metrics", accountId],
    enabled: Boolean(accountId),
    retry(failureCount, error) {
      if (isPermissionError(error)) {
        return false;
      }
      return failureCount < 3;
    },
    queryFn: async () => {
      const [{ count: guardCount, error: guardError }, { count: shiftCount, error: shiftError }, { count: incidentCount, error: incidentError }, { count: reportCount, error: reportError }] =
        await Promise.all([
          supabase.from("guards").select("id", { count: "exact", head: true }).eq("account_id", accountId),
          supabase
            .from("shifts")
            .select("id", { count: "exact", head: true })
            .eq("account_id", accountId)
            .in("status", ["scheduled", "filled", "in_progress"]),
          supabase
            .from("incidents")
            .select("id", { count: "exact", head: true })
            .eq("account_id", accountId)
            .in("status", ["open", "in_review"]),
          supabase
            .from("reports")
            .select("id", { count: "exact", head: true })
            .eq("account_id", accountId)
            .gte("submitted_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        ]);

      if (guardError) throw guardError;
      if (shiftError) throw shiftError;
      if (incidentError) throw incidentError;
      if (reportError) throw reportError;

      return {
        guard_count: guardCount ?? 0,
        active_shift_count: shiftCount ?? 0,
        open_incident_count: incidentCount ?? 0,
        report_count_last_30_days: reportCount ?? 0,
      } satisfies DashboardMetrics;
    },
  });
}

interface CreateGuardInput {
  first_name: string;
  last_name: string;
  badge_number?: string;
  email?: string;
  phone?: string;
  status?: Guard["status"];
  shift_preference?: Guard["shift_preference"];
  primary_site_id?: string | null;
  hire_date?: string | null;
}

export function useCreateGuard(accountId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation<Guard, PostgrestError, CreateGuardInput>({
    mutationKey: ["create_guard", accountId],
    async mutationFn(input) {
      if (!accountId) {
        throw new Error("An account must be selected before creating guards");
      }
      const payload = {
        account_id: accountId,
        first_name: input.first_name,
        last_name: input.last_name,
        badge_number: input.badge_number ?? null,
        email: input.email ?? null,
        phone: input.phone ?? null,
        status: input.status ?? "active",
        shift_preference: input.shift_preference ?? null,
        primary_site_id: input.primary_site_id ?? null,
        hire_date: input.hire_date ?? null,
      };
      const { data, error } = await supabase
        .from("guards")
        .insert(payload)
        .select(GUARD_FIELDS)
        .single();
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: (_, __, context) => {
      void queryClient.invalidateQueries({ queryKey: ["guards", accountId] });
      return context;
    },
  });
}

interface CreateIncidentInput {
  site_id: string;
  summary: string;
  type: string;
  occurred_at: string;
  severity: IncidentReport["severity"];
  guard_id?: string | null;
  shift_id?: string | null;
}

export function useCreateIncident(accountId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation<IncidentReport, PostgrestError, CreateIncidentInput>({
    mutationKey: ["create_incident", accountId],
    async mutationFn(input) {
      if (!accountId) {
        throw new Error("An account must be selected before reporting incidents");
      }
      const payload = {
        account_id: accountId,
        site_id: input.site_id,
        summary: input.summary,
        type: input.type,
        occurred_at: input.occurred_at,
        severity: input.severity,
        guard_id: input.guard_id ?? null,
        shift_id: input.shift_id ?? null,
        status: "open" as IncidentReport["status"],
      };
      const { data, error } = await supabase
        .from("incidents")
        .insert(payload)
        .select(INCIDENT_FIELDS)
        .single();
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["incidents", accountId] });
    },
  });
}
