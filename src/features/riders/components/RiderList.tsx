import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Rider } from "../types";

interface RiderListProps {
  riders: Rider[];
  isLoading?: boolean;
  error?: string;
}

export function RiderList({ riders, isLoading, error }: RiderListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border-muted">
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/10 text-destructive">
        <CardHeader>
          <CardTitle>Unable to load riders</CardTitle>
          <CardDescription className="text-destructive">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!riders.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No riders yet</CardTitle>
          <CardDescription>
            Add your first rider to start building the roster.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {riders.map((rider) => (
        <Card key={rider.id} className="transition hover:shadow-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">
              <Link
                to={`/riders/${rider.id}`}
                className="text-primary hover:underline"
              >
                {rider.full_name}
              </Link>
            </CardTitle>
            <CardDescription>
              {rider.discipline ? rider.discipline : "No discipline specified"}
            </CardDescription>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{rider.email ?? "No email"}</span>
            </div>
            <Badge variant={rider.is_active ? "default" : "secondary"}>
              {rider.is_active ? "Active" : "Inactive"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            {rider.phone && <div>Phone: {rider.phone}</div>}
            {rider.notes && <div className="line-clamp-2">{rider.notes}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
