
import { useMemo } from "react";
import { format, parseISO } from "date-fns";

import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount } from "@/context/AccountContext";
import {
  useClients,
  useGuards,
  useIncidents,
  useSites,
  useUpcomingShifts,
} from "@/features/operations/hooks";
import type { IncidentReport, ShiftAssignment } from "@/features/operations/types";

const shiftStatusStyles: Record<ShiftAssignment["status"], string> = {
  scheduled: "border-slate-200 bg-slate-100 text-slate-700",
  filled: "border-blue-200 bg-blue-100 text-blue-800",
  in_progress: "border-emerald-200 bg-emerald-100 text-emerald-800",
  completed: "border-emerald-200 bg-emerald-100 text-emerald-800",
  missed: "border-red-200 bg-red-100 text-red-800",
  cancelled: "border-slate-200 bg-slate-100 text-slate-700",
};

const severityStyles: Record<IncidentReport["severity"], string> = {
  low: "border-blue-200 bg-blue-100 text-blue-800",
  medium: "border-amber-200 bg-amber-100 text-amber-800",
  high: "border-orange-200 bg-orange-100 text-orange-800",
  critical: "border-red-200 bg-red-100 text-red-800",
};

const Index = () => {
  const { accountId } = useAccount();
  const {
    data: shifts,
    isLoading: shiftsLoading,
    isError: shiftsError,
    error: shiftsErrorMessage,
  } = useUpcomingShifts(accountId ?? undefined, 7);
  const {
    data: guards,
    isLoading: guardsLoading,
    isError: guardsError,
    error: guardsErrorMessage,
  } = useGuards(accountId ?? undefined, true);
  const {
    data: incidents,
    isLoading: incidentsLoading,
    isError: incidentsError,
    error: incidentsErrorMessage,
  } = useIncidents(accountId ?? undefined, undefined);
  const { data: sites } = useSites(accountId ?? undefined, true);
  const { data: clients } = useClients(accountId ?? undefined);

  const guardSummary = useMemo(() => {
    const summary = {
      active: 0,
      suspended: 0,
      inactive: 0,
      unassigned: 0,
    };
    (guards ?? []).forEach((guard) => {
      if (guard.status === "active") {
        summary.active += 1;
        if (!guard.primary_site_id) {
          summary.unassigned += 1;
        }
      }
      if (guard.status === "suspended") {
        summary.suspended += 1;
      }
      if (guard.status === "inactive") {
        summary.inactive += 1;
      }
    });
    return summary;
  }, [guards]);

  const prioritizedShifts = useMemo(
    () =>
      (shifts ?? [])
        .slice()
        .sort(
          (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        )
        .slice(0, 5),
    [shifts]
  );

  const incidentQueue = useMemo(
    () =>
      (incidents ?? [])
        .filter((incident) => incident.status === "open" || incident.status === "in_review")
        .slice(0, 4),
    [incidents]
  );

  const siteCoverage = useMemo(() => {
    const counts = new Map<string, number>();
    (shifts ?? []).forEach((shift) => {
      if (!shift.site_id) return;
      counts.set(shift.site_id, (counts.get(shift.site_id) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([siteId, count]) => {
        const site = sites?.find((entry) => entry.id === siteId);
        const clientName = site?.client_id
          ? clients?.find((client) => client.id === site.client_id)?.name ?? "—"
          : "Unassigned";
        return {
          siteName: site?.name ?? "Unknown site",
          clientName,
          count,
        };
      });
  }, [shifts, sites, clients]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-guard-900">Command Center</h1>
          <p className="text-guard-500">
            Real-time visibility into guard staffing, incidents, and client-facing reports.
          </p>
        </div>
        <DashboardStats />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Upcoming shifts</CardTitle>
                <CardDescription>Next seven days of coverage commitments</CardDescription>
              </div>
              <p className="text-xs text-guard-500">
                Stay ahead of uncovered posts and confirm guard check-ins before shift start.
              </p>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guard</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shiftsLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={5}>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : shiftsError ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-6 text-sm text-red-600">
                          {shiftsErrorMessage?.message ?? "Unable to load shift assignments."}
                        </TableCell>
                      </TableRow>
                    ) : prioritizedShifts.length > 0 ? (
                      prioritizedShifts.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell>
                            {shift.guard
                              ? `${shift.guard.first_name} ${shift.guard.last_name}`
                              : "Unassigned"}
                          </TableCell>
                          <TableCell>{shift.site?.name ?? "—"}</TableCell>
                          <TableCell>{format(parseISO(shift.start_time), "MMM d, h:mm a")}</TableCell>
                          <TableCell>{format(parseISO(shift.end_time), "MMM d, h:mm a")}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={shiftStatusStyles[shift.status]}>
                              {shift.status.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="py-8 text-center text-sm text-guard-500">
                          No upcoming shifts scheduled. Add coverage to keep your sites protected.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Roster health</CardTitle>
              <CardDescription>Snapshot of guard availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {guardsLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : guardsError ? (
                <p className="text-sm text-red-600">
                  {guardsErrorMessage?.message ?? "Unable to load guard roster."}
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-guard-600">Active guards</span>
                    <span className="font-semibold text-guard-900">{guardSummary.active}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-guard-600">Unassigned posts</span>
                    <span className="font-semibold text-guard-900">{guardSummary.unassigned}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-guard-600">Suspended</span>
                    <span className="font-semibold text-guard-900">{guardSummary.suspended}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-guard-600">Inactive</span>
                    <span className="font-semibold text-guard-900">{guardSummary.inactive}</span>
                  </div>
                </div>
              )}
              <p className="text-xs text-guard-500">
                Track guard readiness, certifications, and site assignments to respond to last-minute
                call-offs.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-col gap-2">
              <div>
                <CardTitle>Incident response queue</CardTitle>
                <CardDescription>Items requiring supervisor follow-up</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {incidentsLoading ? (
                <Skeleton className="h-36 w-full" />
              ) : incidentsError ? (
                <p className="text-sm text-red-600">
                  {incidentsErrorMessage?.message ?? "Unable to load incidents."}
                </p>
              ) : incidentQueue.length > 0 ? (
                <ul className="space-y-4">
                  {incidentQueue.map((incident) => (
                    <li key={incident.id} className="rounded-md border border-guard-100 bg-guard-50 p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-guard-900">{incident.type}</p>
                        <Badge variant="outline" className={severityStyles[incident.severity]}>
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-guard-500">
                        {format(parseISO(incident.occurred_at), "MMM d, h:mm a")} • {incident.site?.name ?? "Unknown site"}
                      </p>
                      <p className="mt-2 text-sm text-guard-600">{incident.summary}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-guard-500">
                  No incidents pending review. Maintain regular patrols and wellness checks.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client coverage summary</CardTitle>
              <CardDescription>Shifts scheduled per site over the next week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead className="text-right">Shifts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shiftsLoading ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={3}>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : siteCoverage.length > 0 ? (
                      siteCoverage.map((entry) => (
                        <TableRow key={entry.siteName}>
                          <TableCell className="font-medium">{entry.siteName}</TableCell>
                          <TableCell>{entry.clientName}</TableCell>
                          <TableCell className="text-right">{entry.count}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-sm text-guard-500">
                          No sites have upcoming coverage. Schedule shifts to keep clients informed.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
