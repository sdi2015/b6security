
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, Printer } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface Report {
  id: number;
  type: string;
  date: Date;
  status: "Generated" | "Pending";
  description: string;
}

const chartData = [
  { date: "01/24", incidents: 4 },
  { date: "02/24", incidents: 6 },
  { date: "03/24", incidents: 3 },
  { date: "04/24", incidents: 8 },
  { date: "05/24", incidents: 5 },
];

const initialReports: Report[] = [
  {
    id: 1,
    type: "Incident Summary",
    date: new Date(),
    status: "Generated",
    description: "Monthly summary of all security incidents",
  },
  {
    id: 2,
    type: "Guard Performance",
    date: new Date(),
    status: "Generated",
    description: "Quarterly guard performance evaluation",
  },
  {
    id: 3,
    type: "Shift Coverage",
    date: new Date(),
    status: "Pending",
    description: "Weekly shift coverage analysis",
  },
];

const Reports = () => {
  const [reports] = useState<Report[]>(initialReports);
  const [timeframe, setTimeframe] = useState("month");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate and view security operation reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Reports</CardTitle>
              <CardDescription>All generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reports.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>Reports awaiting generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {reports.filter((r) => r.status === "Pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Today</CardTitle>
              <CardDescription>Reports created today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Incident Trends</CardTitle>
            <Select
              defaultValue={timeframe}
              onValueChange={(value) => setTimeframe(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="date" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="incidents"
                    stroke="#9b87f5"
                    fill="#9b87f5"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>List of all generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {report.type}
                    </TableCell>
                    <TableCell>
                      {report.date.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === "Generated"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell>{report.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
