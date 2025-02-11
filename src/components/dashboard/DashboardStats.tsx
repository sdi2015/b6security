
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSquare2, CalendarDays, Bell, ClipboardList } from "lucide-react";

const stats = [
  {
    title: "Active Guards",
    value: "24",
    icon: UserSquare2,
    trend: "+2 this week",
  },
  {
    title: "Scheduled Shifts",
    value: "156",
    icon: CalendarDays,
    trend: "Next 7 days",
  },
  {
    title: "Active Incidents",
    value: "3",
    icon: Bell,
    trend: "2 require attention",
  },
  {
    title: "Reports Generated",
    value: "28",
    icon: ClipboardList,
    trend: "This month",
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="animate-fade-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-guard-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-guard-500">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
