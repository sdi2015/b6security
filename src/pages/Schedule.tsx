import { useMemo, useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";

import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar } from "@/components/ui/calendar";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount } from "@/context/AccountContext";
import { useSites, useUpcomingShifts } from "@/features/operations/hooks";
import type { ShiftAssignment } from "@/features/operations/types";

const statusStyles: Record<ShiftAssignment["status"], string> = {
  scheduled: "border-slate-200 bg-slate-100 text-slate-700",
  filled: "border-blue-200 bg-blue-100 text-blue-800",
  in_progress: "border-emerald-200 bg-emerald-100 text-emerald-800",
  completed: "border-emerald-200 bg-emerald-100 text-emerald-800",
  missed: "border-red-200 bg-red-100 text-red-800",
  cancelled: "border-slate-200 bg-slate-100 text-slate-700",
};

export default function Schedule() {
  const { accountId } = useAccount();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data: shifts, isLoading, isError, error } = useUpcomingShifts(accountId ?? undefined, 30);
  const { data: sites } = useSites(accountId ?? undefined, true);

  const assignmentsForDay = useMemo(() => {
    if (!shifts) return [];
    return shifts.filter((shift) => isSameDay(parseISO(shift.start_time), selectedDate));
  }, [shifts, selectedDate]);

  const busiestDay = useMemo(() => {
    if (!shifts?.length) return null;
    const counts = new Map<string, number>();
    shifts.forEach((shift) => {
      const day = format(parseISO(shift.start_time), "yyyy-MM-dd");
      counts.set(day, (counts.get(day) ?? 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0] ?? null;
  }, [shifts]);

  const totalHours = useMemo(() => {
    if (!shifts) return 0;
    return shifts.reduce((total, shift) => {
      const start = new Date(shift.start_time).getTime();
      const end = new Date(shift.end_time).getTime();
      const hours = (end - start) / (1000 * 60 * 60);
      return total + Math.max(hours, 0);
    }, 0);
  }, [shifts]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-guard-900">Shift schedule</h1>
            <p className="text-guard-500">Monitor coverage across all client sites for the next 30 days.</p>
          </div>
          <Button variant="outline" disabled>
            Import from scheduling tool (coming soon)
          </Button>
        </div>

        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load shifts</AlertTitle>
            <AlertDescription>{error?.message ?? "Unknown error"}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Select date</CardTitle>
              <CardDescription>Tap any day to view assigned guards</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total shifts</CardTitle>
                  <CardDescription>Next 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-guard-900">
                    {isLoading ? <Skeleton className="h-8 w-16" /> : (shifts ?? []).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Coverage hours</CardTitle>
                  <CardDescription>Scheduled workload</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-guard-900">
                    {isLoading ? <Skeleton className="h-8 w-24" /> : `${Math.round(totalHours)} hrs`}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Busiest day</CardTitle>
                  <CardDescription>Most staffed shifts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-guard-900">
                    {isLoading ? (
                      <Skeleton className="h-6 w-40" />
                    ) : busiestDay ? (
                      <>
                        {format(parseISO(`${busiestDay[0]}T00:00:00`), "MMM d, yyyy")} • {busiestDay[1]} shifts
                      </>
                    ) : (
                      "No shifts scheduled"
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Assignments on {format(selectedDate, "MMM d, yyyy")}</CardTitle>
                <CardDescription>Guard roster for the selected day</CardDescription>
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
                      {isLoading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell colSpan={5}>
                              <Skeleton className="h-6 w-full" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : assignmentsForDay.length > 0 ? (
                        assignmentsForDay.map((shift) => (
                          <TableRow key={shift.id}>
                            <TableCell>
                              {shift.guard
                                ? `${shift.guard.first_name} ${shift.guard.last_name}`
                                : "Unassigned"}
                            </TableCell>
                            <TableCell>{shift.site?.name ?? "—"}</TableCell>
                            <TableCell>{format(parseISO(shift.start_time), "h:mm a")}</TableCell>
                            <TableCell>{format(parseISO(shift.end_time), "h:mm a")}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusStyles[shift.status]}>
                                {shift.status.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="py-10 text-center text-sm text-guard-500">
                            No assignments on this date.
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

        <Card>
          <CardHeader>
            <CardTitle>Sites scheduled</CardTitle>
            <CardDescription>Locations with at least one shift</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead>Total shifts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={3}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : shifts && shifts.length > 0 ? (
                  Array.from(
                    shifts.reduce((map, shift) => {
                      if (!shift.site_id) return map;
                      const count = map.get(shift.site_id) ?? 0;
                      map.set(shift.site_id, count + 1);
                      return map;
                    }, new Map<string, number>()).entries()
                  ).map(([siteId, count]) => {
                    const site = sites?.find((s) => s.id === siteId);
                    return (
                      <TableRow key={siteId}>
                        <TableCell>{site?.name ?? "Unknown site"}</TableCell>
                        <TableCell className="uppercase">{site?.timezone ?? ""}</TableCell>
                        <TableCell>{count}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="py-10 text-center text-sm text-guard-500">
                      No scheduled shifts to display.
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
