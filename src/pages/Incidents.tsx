import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "@/context/AccountContext";
import {
  useCreateIncident,
  useGuards,
  useIncidents,
  useSites,
} from "@/features/operations/hooks";
import type { IncidentReport } from "@/features/operations/types";
import { AlertCircle, Shield } from "lucide-react";

const incidentSchema = z.object({
  site_id: z.string().min(1, "Select a site"),
  type: z.string().min(1, "Enter an incident type"),
  summary: z.string().min(1, "Provide a description"),
  severity: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Select a severity",
  }),
  occurred_at: z.string().min(1, "Specify the timestamp"),
  guard_id: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
});

const severityStyles: Record<IncidentReport["severity"], string> = {
  low: "border-blue-200 bg-blue-100 text-blue-800",
  medium: "border-amber-200 bg-amber-100 text-amber-800",
  high: "border-orange-200 bg-orange-100 text-orange-800",
  critical: "border-red-200 bg-red-100 text-red-800",
};

const statusStyles: Record<IncidentReport["status"], string> = {
  open: "border-red-200 bg-red-100 text-red-800",
  in_review: "border-amber-200 bg-amber-100 text-amber-800",
  resolved: "border-emerald-200 bg-emerald-100 text-emerald-800",
  archived: "border-slate-200 bg-slate-100 text-slate-700",
};

export default function Incidents() {
  const { accountId } = useAccount();
  const [statusFilter, setStatusFilter] = useState<"open" | "in_review" | "resolved" | "archived" | "all">("open");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: incidents, isLoading, isError, error } = useIncidents(
    accountId ?? undefined,
    statusFilter === "all" ? undefined : statusFilter
  );
  const { data: sites } = useSites(accountId ?? undefined, false);
  const { data: guards } = useGuards(accountId ?? undefined, false);
  const createIncident = useCreateIncident(accountId ?? undefined);
  const { toast } = useToast();

  const highSeverityCount = useMemo(
    () => (incidents ?? []).filter((incident) => incident.severity === "high" || incident.severity === "critical").length,
    [incidents]
  );
  const openIncidents = useMemo(() => (incidents ?? []).filter((incident) => incident.status === "open"), [incidents]);

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
        title: "Incident logged",
        description: "Field teams and clients will see the update immediately.",
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create incident";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-guard-900">Incident management</h1>
            <p className="text-guard-500">
              Monitor active events, escalate to clients, and resolve follow-up tasks.
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>Report incident</Button>
        </div>

        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load incidents</AlertTitle>
            <AlertDescription>{error?.message ?? "Unknown error"}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Open incidents
              </CardTitle>
              <CardDescription>Requiring action from command</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : openIncidents.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> High severity
              </CardTitle>
              <CardDescription>Incidents flagged as high or critical</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : highSeverityCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>30-day volume</CardTitle>
              <CardDescription>Total incidents returned from Supabase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : (incidents ?? []).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in_review">In review</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <TabsContent value={statusFilter} className="mt-4">
            <div className="border rounded-lg bg-white shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={6}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : incidents && incidents.length > 0 ? (
                    incidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>{format(parseISO(incident.occurred_at), "MMM d, yyyy h:mm a")}</TableCell>
                        <TableCell>{incident.site?.name ?? "Unknown site"}</TableCell>
                        <TableCell className="font-medium">{incident.type}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={severityStyles[incident.severity]}>
                            {incident.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusStyles[incident.status]}>
                            {incident.status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xl whitespace-normal text-sm text-guard-600">
                          {incident.summary}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-sm text-guard-500">
                        No incidents found for this filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report new incident</DialogTitle>
            <DialogDescription>
              Capture the essential information for supervisors and clients.
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
                        placeholder="Include key details, witnesses, and immediate response"
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
                        <SelectItem value="">Not specified</SelectItem>
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
                  {createIncident.isLoading ? "Submitting..." : "Submit incident"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
