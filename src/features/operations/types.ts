export type GuardStatus = "active" | "inactive" | "suspended";

export interface Guard {
  id: string;
  account_id: string;
  badge_number: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: GuardStatus;
  shift_preference: "day" | "swing" | "night" | null;
  primary_site_id: string | null;
  hire_date: string | null;
  certifications: string[] | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientAccount {
  id: string;
  account_id: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  status: "active" | "pending" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  account_id: string;
  client_id: string | null;
  name: string;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ShiftStatus = "scheduled" | "filled" | "in_progress" | "completed" | "missed" | "cancelled";

export interface ShiftAssignment {
  id: string;
  account_id: string;
  site_id: string;
  guard_id: string | null;
  start_time: string;
  end_time: string;
  status: ShiftStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  site?: Pick<Site, "id" | "name" | "timezone"> | null;
  guard?: Pick<Guard, "id" | "first_name" | "last_name" | "badge_number"> | null;
}

export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "open" | "in_review" | "resolved" | "archived";

export interface IncidentReport {
  id: string;
  account_id: string;
  site_id: string;
  guard_id: string | null;
  shift_id: string | null;
  occurred_at: string;
  type: string;
  summary: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  follow_up_due_at: string | null;
  created_at: string;
  updated_at: string;
  site?: Pick<Site, "id" | "name"> | null;
  guard?: Pick<Guard, "id" | "first_name" | "last_name"> | null;
}

export interface OperationsReport {
  id: string;
  account_id: string;
  site_id: string | null;
  guard_id: string | null;
  shift_id: string | null;
  report_type: string;
  submitted_at: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  guard_count: number;
  active_shift_count: number;
  open_incident_count: number;
  report_count_last_30_days: number;
}
