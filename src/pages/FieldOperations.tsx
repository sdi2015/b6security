import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "@/context/AccountContext";
import {
  useCreateIncident,
  useGuards,
  useIncidents,
  useSites,
  useUpcomingShifts,
} from "@/features/operations/hooks";

const incidentSchema = z.object({
  site_id: z.string().min(1, "Select a site"),
  type: z.string().min(1, "Enter an incident type"),
  summary: z.string().min(1, "Provide a short summary"),
  severity: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Select a severity",
  }),
  occurred_at: z.string().min(1, "Specify when this occurred"),
  guard_id: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
});

export default function FieldOperations() {
  const { accountId } = useAccount();
  const { data: shifts, isLoading: shiftsLoading } = useUpcomingShifts(accountId ?? undefined, 7);
  const { data: incidents, isLoading: incidentsLoading, isError: incidentsError, error: incidentsErrorMessage } =
    useIncidents(accountId ?? undefined, "open");
  const { data: sites } = useSites(accountId ?? undefined, false);
  const { data: guards } = useGuards(accountId ?? undefined, false);
  const createIncident = useCreateIncident(accountId ?? undefined);
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const upcomingShift = useMemo(() => (shifts ?? [])[0], [shifts]);

  const form = useForm<z.infer<typeof incidentSchema>>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      site_id: "",
      type: "",
      summary: "",
      severity: "medium",
      occurred_at: new Date().toISOString().slice(0, 16),
      guard_id: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await createIncident.mutateAsync({
        site_id: values.site_id,
        type: values.type,
        summary: values.summary,
        severity: values.severity,
        occurred_at: new Date(values.occurred_at).toISOString(),
        guard_id: values.guard_id ?? null,
      });
      toast({
        title: "Incident submitted",
        description: "Command has been notified and will follow up shortly.",
      });
      form.reset({
        site_id: "",
        type: "",
        summary: "",
        severity: "medium",
        occurred_at: new Date().toISOString().slice(0, 16),
        guard_id: "",
      });
      setIsDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit incident";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-guard-900">Field operations</h1>
            <p className="text-guard-500">
              Guard-facing checklist for shift readiness and rapid incident capture.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">Report incident</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report an incident</DialogTitle>
                <DialogDescription>
                  Provide the details needed for command staff to triage and notify the client.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="site_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a site" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(sites ?? []).map((site) => (
                              <SelectItem key={site.id} value={site.id}>
                                {site.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident type</FormLabel>
                        <FormControl>
                          <Input placeholder="Unauthorized access" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Short description of what occurred"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="occurred_at"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occurred at</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="guard_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reporting guard</FormLabel>
                        <Select
                          value={field.value ?? ""}
                          onValueChange={(value) => field.onChange(value || undefined)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Optional" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Not listed</SelectItem>
                            {(guards ?? []).map((guard) => (
                              <SelectItem key={guard.id} value={guard.id}>
                                {guard.first_name} {guard.last_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createIncident.isLoading}>
                      {createIncident.isLoading ? "Submitting..." : "Submit"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Next shift</CardTitle>
              <CardDescription>Upcoming assignment in the next seven days</CardDescription>
            </CardHeader>
            <CardContent>
              {shiftsLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : upcomingShift ? (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-guard-900">
                    {upcomingShift.site?.name ?? "Unassigned site"}
                  </p>
                  <p className="text-sm text-guard-500">
                    {format(parseISO(upcomingShift.start_time), "MMM d, yyyy h:mm a")} – {format(parseISO(upcomingShift.end_time), "h:mm a")}
                  </p>
                  <Badge variant="outline" className="border-blue-200 bg-blue-100 text-blue-800">
                    {upcomingShift.status.replace(/_/g, " ")}
                  </Badge>
                  <p className="text-sm text-guard-500">
                    Assigned guard: {upcomingShift.guard ? `${upcomingShift.guard.first_name} ${upcomingShift.guard.last_name}` : "TBD"}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-guard-500">No shifts scheduled in the next week.</p>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-xs text-guard-500">
                Need to make a change? Contact the command desk to update assignments.
              </p>
            </CardFooter>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>Open incidents</CardTitle>
              <CardDescription>Follow up with command for status updates</CardDescription>
            </CardHeader>
            <CardContent>
              {incidentsError ? (
                <Alert variant="destructive">
                  <AlertTitle>Unable to load incidents</AlertTitle>
                  <AlertDescription>
                    {incidentsErrorMessage?.message ?? "Unknown error"}
                  </AlertDescription>
                </Alert>
              ) : incidentsLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : incidents && incidents.length > 0 ? (
                <ul className="space-y-3">
                  {incidents.slice(0, 4).map((incident) => (
                    <li key={incident.id} className="rounded-md border border-guard-100 bg-guard-50 p-3">
                      <p className="text-sm font-medium text-guard-900">{incident.type}</p>
                      <p className="text-xs text-guard-500">
                        {format(parseISO(incident.occurred_at), "MMM d, yyyy h:mm a")} • {incident.site?.name ?? "Unknown site"}
                      </p>
                      <p className="text-xs text-guard-600 mt-1">{incident.summary}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-guard-500">No open incidents. Stay vigilant!</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="border rounded-lg bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shift</TableHead>
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
              ) : shifts && shifts.length > 0 ? (
                shifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>
                      {shift.guard
                        ? `${shift.guard.first_name} ${shift.guard.last_name}`
                        : "Unassigned"}
                    </TableCell>
                    <TableCell>{shift.site?.name ?? "—"}</TableCell>
                    <TableCell>{format(parseISO(shift.start_time), "MMM d, h:mm a")}</TableCell>
                    <TableCell>{format(parseISO(shift.end_time), "MMM d, h:mm a")}</TableCell>
                    <TableCell className="capitalize">{shift.status.replace(/_/g, " ")}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-guard-500">
                    No upcoming shifts to display.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
