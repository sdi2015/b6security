
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount } from "@/context/AccountContext";
import { useDashboardMetrics } from "@/features/operations/hooks";
import { Bell, CalendarDays, ClipboardList, UserSquare2 } from "lucide-react";

const dashboardCards = [
  {
    title: "Active Guards",
    icon: UserSquare2,
    accessor: "guard_count" as const,
    description: "Personnel cleared for duty",
  },
  {
    title: "Live Shifts",
    icon: CalendarDays,
    accessor: "active_shift_count" as const,
    description: "Scheduled, filled, or in-progress",
  },
  {
    title: "Open Incidents",
    icon: Bell,
    accessor: "open_incident_count" as const,
    description: "Requires supervisor attention",
  },
  {
    title: "Reports (30 days)",
    icon: ClipboardList,
    accessor: "report_count_last_30_days" as const,
    description: "Submitted to clients",
  },
];

export function DashboardStats() {
  const { accountId } = useAccount();
  const { data, isLoading, isError, error } = useDashboardMetrics(accountId);

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Unable to load dashboard metrics</AlertTitle>
        <AlertDescription>{error?.message ?? "Unknown error"}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {dashboardCards.map((card) => {
        const value = data?.[card.accessor] ?? 0;
        const Icon = card.icon;
        return (
          <Card key={card.title} className="animate-fade-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-guard-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{value}</div>
              )}
              <p className="text-xs text-guard-500">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
