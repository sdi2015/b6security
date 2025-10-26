import { useMemo } from "react";

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
import { useAccount } from "@/context/AccountContext";
import { useClients, useSites } from "@/features/operations/hooks";
import { Mail, Phone, UserPlus } from "lucide-react";

const statusStyles: Record<"active" | "pending" | "inactive", string> = {
  active: "border-emerald-200 bg-emerald-100 text-emerald-800",
  pending: "border-amber-200 bg-amber-100 text-amber-800",
  inactive: "border-slate-200 bg-slate-100 text-slate-700",
};

export default function Clients() {
  const { accountId } = useAccount();
  const { data: clients, isLoading, isError, error } = useClients(accountId ?? undefined);
  const { data: sites } = useSites(accountId ?? undefined, true);

  const siteCounts = useMemo(() => {
    const map = new Map<string, number>();
    (sites ?? []).forEach((site) => {
      if (!site.client_id) return;
      map.set(site.client_id, (map.get(site.client_id) ?? 0) + 1);
    });
    return map;
  }, [sites]);

  const activeClients = (clients ?? []).filter((client) => client.status === "active");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-guard-900">Client portal</h1>
            <p className="text-guard-500">
              Manage access for property stakeholders and share incident visibility in real time.
            </p>
          </div>
          <Button variant="default" className="flex items-center gap-2" disabled>
            <UserPlus className="h-4 w-4" /> Invite client (coming soon)
          </Button>
        </div>

        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load clients</AlertTitle>
            <AlertDescription>{error?.message ?? "Unknown error"}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Active clients</CardTitle>
              <CardDescription>Enabled for portal access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : activeClients.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending onboarding</CardTitle>
              <CardDescription>Awaiting portal activation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : (clients ?? []).filter((c) => c.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sites covered</CardTitle>
              <CardDescription>Across all active clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  activeClients.reduce((total, client) => total + (siteCounts.get(client.id) ?? 0), 0)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border rounded-lg bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Point of contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Sites</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : clients && clients.length > 0 ? (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.contact_name ?? "—"}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      {client.contact_email ? (
                        <>
                          <Mail className="h-4 w-4 text-guard-500" />
                          <span>{client.contact_email}</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {client.contact_phone ? (
                        <>
                          <Phone className="h-4 w-4 text-guard-500" />
                          <span>{client.contact_phone}</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{siteCounts.get(client.id) ?? 0}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[client.status]}>
                        {client.status === "pending" ? "Pending" : client.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-guard-500">
                    No client records found. Invite a client to share security updates automatically.
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
