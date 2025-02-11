
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
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
import { AlertCircle, Plus, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Incident {
  id: number;
  date: Date;
  location: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
}

const initialIncidents: Incident[] = [
  {
    id: 1,
    date: new Date(),
    location: "Main Entrance",
    description: "Suspicious package found near entrance",
    severity: "High",
    status: "Open",
  },
  {
    id: 2,
    date: new Date(),
    location: "Parking Lot B",
    description: "Vehicle with unauthorized parking permit",
    severity: "Low",
    status: "Resolved",
  },
];

const IncidentForm = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !location) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Incident reported successfully",
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-1">
          Location
        </label>
        <input
          id="location"
          className="w-full rounded-md border border-input px-3 py-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter incident location"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the incident"
          className="min-h-[100px]"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Submit Report</Button>
      </div>
    </form>
  );
};

const Incidents = () => {
  const [incidents] = useState<Incident[]>(initialIncidents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-guard-900">
              Incident Reports
            </h1>
            <p className="text-guard-500">
              View and manage security incidents
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Report Incident
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report New Incident</DialogTitle>
              </DialogHeader>
              <IncidentForm onClose={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Open Incidents
              </CardTitle>
              <CardDescription>
                Currently active incidents requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {incidents.filter((i) => i.status === "Open").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Total Reports
              </CardTitle>
              <CardDescription>
                Total number of incident reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{incidents.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>
                      {incident.date.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{incident.location}</TableCell>
                    <TableCell>{incident.description}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          incident.severity === "High"
                            ? "bg-red-100 text-red-800"
                            : incident.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {incident.severity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          incident.status === "Open"
                            ? "bg-red-100 text-red-800"
                            : incident.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {incident.status}
                      </span>
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

export default Incidents;
