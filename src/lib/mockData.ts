import type {
  ClientAccount,
  DashboardMetrics,
  Guard,
  IncidentReport,
  OperationsReport,
  ShiftAssignment,
  Site,
} from "@/features/operations/types";

export const MOCK_ACCOUNT_ID = "acct-b6-mock";

function generateId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

const now = new Date();

const mockClients: ClientAccount[] = [
  {
    id: "client-1",
    account_id: MOCK_ACCOUNT_ID,
    name: "Northbridge Logistics",
    contact_name: "Morgan Lee",
    contact_email: "morgan.lee@northbridge.com",
    contact_phone: "(555) 234-1212",
    status: "active",
    created_at: new Date(now.getFullYear() - 1, 2, 15).toISOString(),
    updated_at: new Date(now.getFullYear(), 0, 6).toISOString(),
  },
  {
    id: "client-2",
    account_id: MOCK_ACCOUNT_ID,
    name: "Summit Medical Plaza",
    contact_name: "Priya Natarajan",
    contact_email: "security@summitmedical.com",
    contact_phone: "(555) 867-4411",
    status: "active",
    created_at: new Date(now.getFullYear() - 1, 6, 1).toISOString(),
    updated_at: new Date(now.getFullYear(), 1, 18).toISOString(),
  },
  {
    id: "client-3",
    account_id: MOCK_ACCOUNT_ID,
    name: "Riverside Retail Group",
    contact_name: "Marcus Chen",
    contact_email: "mchen@riversideretail.co",
    contact_phone: "(555) 310-8899",
    status: "pending",
    created_at: new Date(now.getFullYear() - 1, 10, 22).toISOString(),
    updated_at: new Date(now.getFullYear(), 2, 5).toISOString(),
  },
];

const mockSites: Site[] = [
  {
    id: "site-1",
    account_id: MOCK_ACCOUNT_ID,
    client_id: "client-1",
    name: "Northbridge Distribution Center",
    address_line1: "8420 Harbor Way",
    address_line2: null,
    city: "Tacoma",
    state: "WA",
    postal_code: "98402",
    timezone: "America/Los_Angeles",
    is_active: true,
    created_at: new Date(now.getFullYear() - 1, 2, 18).toISOString(),
    updated_at: new Date(now.getFullYear(), 1, 21).toISOString(),
  },
  {
    id: "site-2",
    account_id: MOCK_ACCOUNT_ID,
    client_id: "client-2",
    name: "Summit Medical Campus",
    address_line1: "1900 Alder Ave",
    address_line2: null,
    city: "Denver",
    state: "CO",
    postal_code: "80205",
    timezone: "America/Denver",
    is_active: true,
    created_at: new Date(now.getFullYear() - 1, 5, 4).toISOString(),
    updated_at: new Date(now.getFullYear(), 1, 10).toISOString(),
  },
  {
    id: "site-3",
    account_id: MOCK_ACCOUNT_ID,
    client_id: "client-3",
    name: "Riverside Galleria",
    address_line1: "415 Market St",
    address_line2: "Suite 200",
    city: "Sacramento",
    state: "CA",
    postal_code: "95814",
    timezone: "America/Los_Angeles",
    is_active: false,
    created_at: new Date(now.getFullYear() - 1, 9, 12).toISOString(),
    updated_at: new Date(now.getFullYear(), 0, 28).toISOString(),
  },
];

const mockGuards: Guard[] = [
  {
    id: "guard-1",
    account_id: MOCK_ACCOUNT_ID,
    badge_number: "B6-101",
    first_name: "Ava",
    last_name: "Lopez",
    email: "ava.lopez@b6security.com",
    phone: "(555) 880-1001",
    status: "active",
    shift_preference: "night",
    primary_site_id: "site-1",
    hire_date: new Date(now.getFullYear() - 2, 7, 4).toISOString(),
    certifications: ["BSIS Guard Card", "CPR"],
    avatar_url: null,
    created_at: new Date(now.getFullYear() - 2, 7, 4).toISOString(),
    updated_at: new Date(now.getFullYear(), 1, 11).toISOString(),
  },
  {
    id: "guard-2",
    account_id: MOCK_ACCOUNT_ID,
    badge_number: "B6-118",
    first_name: "Noah",
    last_name: "Patel",
    email: "noah.patel@b6security.com",
    phone: "(555) 880-1002",
    status: "active",
    shift_preference: "day",
    primary_site_id: "site-2",
    hire_date: new Date(now.getFullYear() - 1, 3, 14).toISOString(),
    certifications: ["BSIS Guard Card", "Hospital Security"],
    avatar_url: null,
    created_at: new Date(now.getFullYear() - 1, 3, 14).toISOString(),
    updated_at: new Date(now.getFullYear(), 1, 4).toISOString(),
  },
  {
    id: "guard-3",
    account_id: MOCK_ACCOUNT_ID,
    badge_number: "B6-124",
    first_name: "Imani",
    last_name: "Sullivan",
    email: "imani.sullivan@b6security.com",
    phone: "(555) 880-1003",
    status: "active",
    shift_preference: "swing",
    primary_site_id: "site-1",
    hire_date: new Date(now.getFullYear() - 1, 9, 2).toISOString(),
    certifications: ["BSIS Guard Card"],
    avatar_url: null,
    created_at: new Date(now.getFullYear() - 1, 9, 2).toISOString(),
    updated_at: new Date(now.getFullYear(), 1, 24).toISOString(),
  },
  {
    id: "guard-4",
    account_id: MOCK_ACCOUNT_ID,
    badge_number: "B6-130",
    first_name: "Diego",
    last_name: "Martinez",
    email: "diego.martinez@b6security.com",
    phone: "(555) 880-1004",
    status: "suspended",
    shift_preference: null,
    primary_site_id: null,
    hire_date: new Date(now.getFullYear() - 1, 5, 20).toISOString(),
    certifications: ["BSIS Guard Card"],
    avatar_url: null,
    created_at: new Date(now.getFullYear() - 1, 5, 20).toISOString(),
    updated_at: new Date(now.getFullYear(), 0, 17).toISOString(),
  },
  {
    id: "guard-5",
    account_id: MOCK_ACCOUNT_ID,
    badge_number: "B6-135",
    first_name: "Leah",
    last_name: "Grayson",
    email: "leah.grayson@b6security.com",
    phone: "(555) 880-1005",
    status: "inactive",
    shift_preference: "day",
    primary_site_id: "site-3",
    hire_date: new Date(now.getFullYear() - 3, 1, 11).toISOString(),
    certifications: ["BSIS Guard Card", "CCTV"],
    avatar_url: null,
    created_at: new Date(now.getFullYear() - 3, 1, 11).toISOString(),
    updated_at: new Date(now.getFullYear() - 1, 11, 30).toISOString(),
  },
];

type ShiftInternal = Omit<ShiftAssignment, "site" | "guard">;

const mockShifts: ShiftInternal[] = [
  {
    id: "shift-1",
    account_id: MOCK_ACCOUNT_ID,
    site_id: "site-1",
    guard_id: "guard-1",
    start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0).toISOString(),
    end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 6, 0, 0).toISOString(),
    status: "scheduled",
    notes: "Night patrol with hourly dock checks",
    created_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4, 9, 30, 0).toISOString(),
    updated_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 14, 45, 0).toISOString(),
  },
  {
    id: "shift-2",
    account_id: MOCK_ACCOUNT_ID,
    site_id: "site-2",
    guard_id: "guard-2",
    start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 7, 0, 0).toISOString(),
    end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0, 0).toISOString(),
    status: "filled",
    notes: "Ambulatory escort coverage",
    created_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 10, 0, 0).toISOString(),
    updated_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 16, 0, 0).toISOString(),
  },
  {
    id: "shift-3",
    account_id: MOCK_ACCOUNT_ID,
    site_id: "site-1",
    guard_id: "guard-3",
    start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 0, 0).toISOString(),
    end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 22, 0, 0).toISOString(),
    status: "scheduled",
    notes: "Evening shipping window",
    created_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 8, 45, 0).toISOString(),
    updated_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 17, 20, 0).toISOString(),
  },
  {
    id: "shift-4",
    account_id: MOCK_ACCOUNT_ID,
    site_id: "site-2",
    guard_id: null,
    start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 15, 0, 0).toISOString(),
    end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 23, 0, 0).toISOString(),
    status: "scheduled",
    notes: "Open slot - requires bilingual guard",
    created_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 11, 15, 0).toISOString(),
    updated_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 11, 15, 0).toISOString(),
  },
  {
    id: "shift-5",
    account_id: MOCK_ACCOUNT_ID,
    site_id: "site-1",
    guard_id: "guard-1",
    start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 22, 0, 0).toISOString(),
    end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0).toISOString(),
    status: "completed",
    notes: "Night patrol completed without incident",
    created_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 9, 0, 0).toISOString(),
    updated_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 15, 0).toISOString(),
  },
];

type IncidentInternal = Omit<IncidentReport, "site" | "guard">;

const mockIncidents: IncidentInternal[] = [
  {
    id: "incident-1",
    account_id: MOCK_ACCOUNT_ID,
    site_id: "site-1",
    guard_id: "guard-3",
    shift_id: "shift-3",
    occurred_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 19, 35, 0).toISOString(),
    type: "Access control",
    summary: "Discovered unsecured loading bay door during patrol. Secured door and notified site supervisor.",
    status: "open",
    severity: "medium",
    follow_up_due_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0, 0).toISOString(),
    created_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 10, 0).toISOString(),
    updated_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 20, 10, 0).toISOString(),
  },
  {
    id: "incident-2",
    account_id: MOCK_ACCOUNT_ID,
    site_id: "site-2",
    guard_id: "guard-2",
    shift_id: "shift-2",
    occurred_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 11, 15, 0).toISOString(),
    type: "Patient assist",
    summary: "Supported staff during behavioral health escalation. Incident resolved without injury.",
    status: "in_review",
    severity: "high",
    follow_up_due_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 9, 0, 0).toISOString(),
    created_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 11, 40, 0).toISOString(),
    updated_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 9, 10, 0).toISOString(),
  },
  {
    id: "incident-3",
    account_id: MOCK_ACCOUNT_ID,
    site_id: "site-1",
    guard_id: "guard-1",
    shift_id: "shift-5",
    occurred_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4, 23, 50, 0).toISOString(),
    type: "Alarm response",
    summary: "Responded to warehouse intrusion alarm. Determined to be false alarm triggered by maintenance.",
    status: "resolved",
    severity: "low",
    follow_up_due_at: null,
    created_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4, 23, 55, 0).toISOString(),
    updated_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 15, 25, 0).toISOString(),
  },
];

const mockReports: OperationsReport[] = [
  {
    id: "report-1",
    account_id: MOCK_ACCOUNT_ID,
    site_id: "site-1",
    guard_id: "guard-1",
    shift_id: "shift-5",
    report_type: "Daily activity",
    submitted_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 20, 0).toISOString(),
    title: "Night patrol summary",
    body: "Completed hourly rounds of loading bays and security cages. No irregularities noted after alarm reset.",
    created_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 20, 0).toISOString(),
    updated_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 6, 20, 0).toISOString(),
  },
  {
    id: "report-2",
    account_id: MOCK_ACCOUNT_ID,
    site_id: "site-2",
    guard_id: "guard-2",
    shift_id: "shift-2",
    report_type: "Incident follow-up",
    submitted_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 13, 0, 0).toISOString(),
    title: "Patient assist summary",
    body: "Coordinated with nursing team during escalation. Completed de-escalation checklist and logged witness statements.",
    created_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 13, 0, 0).toISOString(),
    updated_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 13, 0, 0).toISOString(),
  },
  {
    id: "report-3",
    account_id: MOCK_ACCOUNT_ID,
    site_id: null,
    guard_id: null,
    shift_id: null,
    report_type: "Supervisor",
    submitted_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 9, 30, 0).toISOString(),
    title: "Weekly portfolio recap",
    body: "Summarized staffing levels, incident volume, and client-facing updates for operations leadership.",
    created_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 9, 30, 0).toISOString(),
    updated_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 9, 30, 0).toISOString(),
  },
];

function withSiteAndGuard<T extends { site_id: string; guard_id: string | null }>(
  item: T
): T & { site?: Pick<Site, "id" | "name" | "timezone"> | null; guard?: Pick<Guard, "id" | "first_name" | "last_name" | "badge_number"> | null } {
  const site = mockSites.find((entry) => entry.id === item.site_id);
  const guard = item.guard_id ? mockGuards.find((entry) => entry.id === item.guard_id) : undefined;
  return {
    ...item,
    site: site ? { id: site.id, name: site.name, timezone: site.timezone } : null,
    guard: guard
      ? {
          id: guard.id,
          first_name: guard.first_name,
          last_name: guard.last_name,
          badge_number: guard.badge_number,
        }
      : null,
  };
}

function getAccountFilter(accountId?: string | null) {
  return accountId ?? MOCK_ACCOUNT_ID;
}

export function getMockClients(accountId?: string | null) {
  const resolved = getAccountFilter(accountId);
  return mockClients.filter((client) => client.account_id === resolved);
}

export function getMockSites(accountId?: string | null, includeInactive = false) {
  const resolved = getAccountFilter(accountId);
  const sites = mockSites.filter((site) => site.account_id === resolved);
  if (includeInactive) {
    return sites;
  }
  return sites.filter((site) => site.is_active);
}

export function getMockGuards(accountId?: string | null, includeInactive = false) {
  const resolved = getAccountFilter(accountId);
  const guards = mockGuards.filter((guard) => guard.account_id === resolved);
  if (includeInactive) {
    return guards;
  }
  return guards.filter((guard) => guard.status === "active");
}

export function getMockShifts(accountId?: string | null, daysAhead = 14) {
  const resolved = getAccountFilter(accountId);
  const start = new Date();
  const end = new Date(start.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  return mockShifts
    .filter((shift) => {
      if (shift.account_id !== resolved) return false;
      const shiftEnd = new Date(shift.end_time).getTime();
      const shiftStart = new Date(shift.start_time).getTime();
      return shiftEnd >= start.getTime() && shiftStart <= end.getTime();
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .map((shift) => withSiteAndGuard(shift));
}

export function getMockIncidents(accountId?: string | null, statusFilter?: string) {
  const resolved = getAccountFilter(accountId);
  return mockIncidents
    .filter((incident) => incident.account_id === resolved)
    .filter((incident) => (statusFilter ? incident.status === statusFilter : true))
    .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
    .map((incident) => withSiteAndGuard(incident));
}

export function getMockReports(accountId?: string | null) {
  const resolved = getAccountFilter(accountId);
  return mockReports
    .filter((report) => report.account_id === resolved)
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
}

export function getMockDashboardMetrics(accountId?: string | null): DashboardMetrics {
  const resolved = getAccountFilter(accountId);
  const guardCount = mockGuards.filter((guard) => guard.account_id === resolved && guard.status === "active").length;
  const activeShiftCount = mockShifts.filter(
    (shift) =>
      shift.account_id === resolved && ["scheduled", "filled", "in_progress"].includes(shift.status)
  ).length;
  const openIncidents = mockIncidents.filter(
    (incident) => incident.account_id === resolved && ["open", "in_review"].includes(incident.status)
  ).length;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentReports = mockReports.filter(
    (report) => report.account_id === resolved && new Date(report.submitted_at) >= thirtyDaysAgo
  ).length;
  return {
    guard_count: guardCount,
    active_shift_count: activeShiftCount,
    open_incident_count: openIncidents,
    report_count_last_30_days: recentReports,
  };
}

type GuardCreationInput = {
  account_id: string;
  first_name: string;
  last_name: string;
  badge_number?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: Guard["status"];
  shift_preference?: Guard["shift_preference"];
  primary_site_id?: string | null;
  hire_date?: string | null;
};

export function addMockGuard(input: GuardCreationInput): Guard {
  const newGuard: Guard = {
    id: generateId("guard"),
    account_id: input.account_id,
    badge_number: input.badge_number ?? null,
    first_name: input.first_name,
    last_name: input.last_name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    status: input.status ?? "active",
    shift_preference: input.shift_preference ?? null,
    primary_site_id: input.primary_site_id ?? null,
    hire_date: input.hire_date ?? new Date().toISOString(),
    certifications: [],
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockGuards.unshift(newGuard);
  return newGuard;
}

type IncidentCreationInput = {
  account_id: string;
  site_id: string;
  summary: string;
  type: string;
  occurred_at: string;
  severity: IncidentReport["severity"];
  guard_id?: string | null;
  shift_id?: string | null;
};

export function addMockIncident(input: IncidentCreationInput): IncidentReport {
  const newIncident: IncidentInternal = {
    id: generateId("incident"),
    account_id: input.account_id,
    site_id: input.site_id,
    guard_id: input.guard_id ?? null,
    shift_id: input.shift_id ?? null,
    occurred_at: input.occurred_at,
    type: input.type,
    summary: input.summary,
    status: "open",
    severity: input.severity,
    follow_up_due_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockIncidents.unshift(newIncident);
  return withSiteAndGuard(newIncident);
}
