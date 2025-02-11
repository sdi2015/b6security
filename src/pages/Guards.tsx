
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface Guard {
  id: number;
  name: string;
  badge: string;
  status: "Active" | "Inactive";
  shift: "Day" | "Night";
  phone: string;
}

const initialGuards: Guard[] = [
  {
    id: 1,
    name: "John Doe",
    badge: "G001",
    status: "Active",
    shift: "Day",
    phone: "(555) 123-4567",
  },
  {
    id: 2,
    name: "Jane Smith",
    badge: "G002",
    status: "Active",
    shift: "Night",
    phone: "(555) 234-5678",
  },
];

const Guards = () => {
  const [guards, setGuards] = useState<Guard[]>(initialGuards);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-guard-900">
              Guards
            </h1>
            <p className="text-guard-500">Manage your security personnel</p>
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Guard
          </Button>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Badge #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guards.map((guard) => (
                <TableRow key={guard.id}>
                  <TableCell>{guard.name}</TableCell>
                  <TableCell>{guard.badge}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        guard.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {guard.status}
                    </span>
                  </TableCell>
                  <TableCell>{guard.shift}</TableCell>
                  <TableCell>{guard.phone}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Guards;
