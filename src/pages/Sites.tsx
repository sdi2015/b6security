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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAccount } from "@/context/AccountContext";
import { useClients, useSites } from "@/features/operations/hooks";

function formatAddress(
  addressLine1: string | null,
  addressLine2: string | null,
  city: string | null,
  state: string | null,
  postalCode: string | null
) {
  const lines = [addressLine1, addressLine2].filter(Boolean);
  const cityState = [city, state].filter(Boolean).join(", ");
  const postal = postalCode ? postalCode : "";
  const parts = [lines.join(" "), cityState, postal].filter(Boolean);
  return parts.join(" • ") || "—";
}

export default function Sites() {
  const { accountId } = useAccount();
  const { data: sites, isLoading, isError, error } = useSites(accountId ?? undefined, true);
  const { data: clients } = useClients(accountId ?? undefined);

  const activeCount = useMemo(() => (sites ?? []).filter((site) => site.is_active).length, [sites]);
  const clientLookup = useMemo(() => {
    const map = new Map<string, string>();
    (clients ?? []).forEach((client) => {
      map.set(client.id, client.name);
    });
    return map;
  }, [clients]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-guard-900">Sites</h1>
            <p className="text-guard-500">
              Track properties, associated clients, and timezone-specific coverage requirements.
            </p>
          </div>
          <Button variant="outline" disabled>
            Site creation managed via operations desk
          </Button>
        </div>

        {isError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load sites</AlertTitle>
            <AlertDescription>{error?.message ?? "Unknown error"}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Active sites</CardTitle>
              <CardDescription>Currently staffed properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : activeCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total portfolio</CardTitle>
              <CardDescription>All client locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : (sites ?? []).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Client accounts</CardTitle>
              <CardDescription>Linked to at least one site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-guard-900">
                {isLoading ? <Skeleton className="h-8 w-16" /> : new Set((sites ?? []).map((site) => site.client_id).filter(Boolean)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border rounded-lg bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timezone</TableHead>
                <TableHead>Status</TableHead>
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
              ) : sites && sites.length > 0 ? (
                sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>
                      {site.client_id ? clientLookup.get(site.client_id) ?? "—" : "Unassigned"}
                    </TableCell>
                    <TableCell>{formatAddress(site.address_line1, site.address_line2, site.city, site.state, site.postal_code)}</TableCell>
                    <TableCell className="uppercase">{site.timezone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={site.is_active ? "border-emerald-200 bg-emerald-100 text-emerald-800" : "border-slate-200 bg-slate-100 text-slate-700"}>
                        {site.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-guard-500">
                    No sites found. Add a site to start scheduling guard coverage.
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
