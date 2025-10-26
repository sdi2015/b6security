import { useMemo, useState } from "react";
import { format, parseISO, subMonths } from "date-fns";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount } from "@/context/AccountContext";
import { useIncidents, useReports, useSites } from "@/features/operations/hooks";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, FileText, Printer } from "lucide-react";

import type { IncidentReport } from "@/features/operations/types";

function createIncidentTrend(incidents: IncidentReport[] | undefined) {
  const now = new Date();
  const buckets: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const bucketDate = subMonths(now, i);
    const key = format(bucketDate, "yyyy-MM");
    const label = format(bucketDate, "MMM yy");
    const count = (incidents ?? []).filter((incident) => format(parseISO(incident.occurred_at), "yyyy-MM") === key).length;
    buckets.push({ label, count });
  }
  return buckets;
}

export default function Reports() {
  const { accountId } = useAccount();
  const { data: reports, isLoading, isError, error } = useReports(accountId ?? undefined);
  const { data: incidents } = useIncidents(accountId ?? undefined, undefined);
  const { data: sites } = useSites(accountId ?? undefined, true);
  const [filter, setFilter] = useState<string>("all");

  const filteredReports = useMemo(() => {
    if (!reports) return [];
    if (filter === "all") return reports;
    return reports.filter((report) => report.report_type === filter);
  }, [reports, filter]);

  const incidentTrend = useMemo(() => createIncidentTrend(incidents), [incidents]);
  const reportsLastSevenDays = useMemo(() => {
    if (!reports) return 0;
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 7);
    return reports.filter((report) => new Date(report.submitted_at) >= threshold).length;
  }, [reports]);

  const coverageBySite = useMemo(() => {
    if (!reports) return new Map<string, number>();
    return reports.reduce((map, report) => {
      if (!report.site_id) return map;
      map.set(report.site_id, (map.get(report.site_id) ?? 0) + 1);
      return map;
    }, new Map<string, number>());
  }, [reports]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-guard-900">Reports</h1>
            <p className="text-guard-500">Publish incident summaries and patrol logs for stakeholders.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <Printer className="h-4 w-4" /> Print (coming soon)
            </Button>
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load reports</AlertTitle>
            <AlertDescription>{error?.message ?? "Unknown error"}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total reports</CardTitle>
              <CardDescription>Supabase operations_reports table</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : (reports ?? []).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Last 7 days</CardTitle>
              <CardDescription>Recently published updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : reportsLastSevenDays}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sites covered</CardTitle>
              <CardDescription>Reports delivered per client location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  Array.from(coverageBySite.values()).filter(Boolean).length
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Incident trend</CardTitle>
              <CardDescription>Rolling six-month incident volume</CardDescription>
            </div>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All report types</option>
              {Array.from(new Set((reports ?? []).map((report) => report.report_type))).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incidentTrend}>
                    <defs>
                      <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" stroke="#94a3b8" />
                    <YAxis allowDecimals={false} stroke="#94a3b8" />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#4f46e5" fill="url(#incidentGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published reports</CardTitle>
            <CardDescription>Filtered by type: {filter === "all" ? "All" : filter}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Title</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={4}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((report) => {
                    const siteName = report.site_id
                      ? sites?.find((site) => site.id === report.site_id)?.name ?? "Unknown site"
                      : "Portfolio";
                    return (
                      <TableRow key={report.id}>
                        <TableCell className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-guard-500" />
                          {report.report_type}
                        </TableCell>
                        <TableCell>{format(parseISO(report.submitted_at), "MMM d, yyyy h:mm a")}</TableCell>
                        <TableCell>{siteName}</TableCell>
                        <TableCell className="max-w-xl text-sm text-guard-700">{report.title}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-guard-500">
                      No reports available for the selected type.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
