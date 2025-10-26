import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "@/context/AccountContext";
import { useCreateGuard, useGuards, useSites } from "@/features/operations/hooks";
import type { Guard } from "@/features/operations/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserPlus2 } from "lucide-react";

const guardFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  badge_number: z.string().max(32, "Badge number is too long").optional(),
  email: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
  phone: z.string().optional().or(z.literal(""))
    .transform((value) => value || undefined),
  shift_preference: z
    .enum(["day", "swing", "night"], {
      required_error: "Select a preferred shift",
    })
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? (value as Guard["shift_preference"]) : undefined)),
  primary_site_id: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined),
});

const statusStyles: Record<Guard["status"], string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  inactive: "bg-slate-100 text-slate-700 border-slate-200",
  suspended: "bg-amber-100 text-amber-800 border-amber-200",
};

function GuardStatusBadge({ guard }: { guard: Guard }) {
  return (
    <Badge
      variant="outline"
      className={clsx("capitalize", statusStyles[guard.status])}
    >
      {guard.status}
    </Badge>
  );
}

function AddGuardDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { accountId } = useAccount();
  const { data: sites } = useSites(accountId ?? undefined);
  const createGuard = useCreateGuard(accountId ?? undefined);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof guardFormSchema>>({
    resolver: zodResolver(guardFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      badge_number: "",
      email: "",
      phone: "",
      shift_preference: undefined,
      primary_site_id: undefined,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await createGuard.mutateAsync({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        badge_number: values.badge_number?.trim() || undefined,
        email: values.email?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        shift_preference: values.shift_preference ?? null,
        primary_site_id: values.primary_site_id ?? null,
      });
      toast({
        title: "Guard added",
        description: `${values.first_name} ${values.last_name} has been added to the roster`,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create guard";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add guard</DialogTitle>
          <DialogDescription>Invite a guard to the B6 Security roster.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="Alex" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Rivera" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="badge_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badge number</FormLabel>
                    <FormControl>
                      <Input placeholder="B6-045" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shift_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred shift</FormLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(value) => field.onChange(value || undefined)}
                    >
                      <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No preference</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="swing">Swing</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="alex@b6security.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="primary_site_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary site</FormLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(value) => field.onChange(value || undefined)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign to a site" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createGuard.isLoading}>
                {createGuard.isLoading ? "Saving..." : "Add guard"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function Guards() {
  const { accountId } = useAccount();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: guards, isLoading, isError, error } = useGuards(accountId ?? undefined, true);

  const activeGuards = useMemo(() => (guards ?? []).filter((guard) => guard.status === "active"), [guards]);
  const canManage = Boolean(accountId);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-guard-900">Guard roster</h1>
            <p className="text-guard-500">Manage employment status, assignments, and contact details.</p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
            disabled={!canManage}
          >
            <UserPlus2 className="h-4 w-4" />
            Add guard
          </Button>
        </div>

        {!canManage ? (
          <Alert>
            <AlertTitle>Connect to an account</AlertTitle>
            <AlertDescription>
              Sign in or switch to an account with manager permissions to add or update guards.
            </AlertDescription>
          </Alert>
        ) : null}

        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load guards</AlertTitle>
            <AlertDescription>{error?.message ?? "Unknown error"}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-guard-500">Active guards</p>
            <p className="text-3xl font-semibold text-guard-900">
              {isLoading ? <Skeleton className="h-8 w-16" /> : activeGuards.length}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-guard-500">Total roster</p>
            <p className="text-3xl font-semibold text-guard-900">
              {isLoading ? <Skeleton className="h-8 w-16" /> : (guards ?? []).length}
            </p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-guard-500">Suspended</p>
            <p className="text-3xl font-semibold text-guard-900">
              {isLoading ? <Skeleton className="h-8 w-16" /> : (guards ?? []).filter((g) => g.status === "suspended").length}
            </p>
          </div>
        </div>

        <div className="border rounded-lg bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preferred shift</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : guards && guards.length > 0 ? (
                guards.map((guard) => (
                  <TableRow key={guard.id}>
                    <TableCell className="font-medium">
                      {guard.first_name} {guard.last_name}
                    </TableCell>
                    <TableCell>{guard.badge_number ?? "—"}</TableCell>
                    <TableCell>
                      <GuardStatusBadge guard={guard} />
                    </TableCell>
                    <TableCell className="capitalize">{guard.shift_preference ?? "Unassigned"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        {guard.email ? <span>{guard.email}</span> : null}
                        {guard.phone ? <span className="text-guard-500">{guard.phone}</span> : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-guard-500">
                    No guards found. Add your first guard to start staffing sites.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <AddGuardDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </AppLayout>
  );
}
