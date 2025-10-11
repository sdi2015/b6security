import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount } from "@/context/AccountContext";
import { useRiders } from "@/features/riders/hooks";
import { RiderList } from "@/features/riders/components/RiderList";
import { CreateRiderForm } from "@/features/riders/components/RiderForm";

const skeleton = (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default function RidersPage() {
  const { accountId, role, status, error, refresh } = useAccount();
  const [includeInactive, setIncludeInactive] = useState(false);
  const {
    data: riders = [],
    isLoading,
    isFetching,
    error: ridersError,
  } = useRiders(accountId, { includeInactive });

  const canManage = role === "owner" || role === "manager";

  if (status === "loading") {
    return <AppLayout>{skeleton}</AppLayout>;
  }

  if (status === "error") {
    return (
      <AppLayout>
        <Card className="border-destructive/50 bg-destructive/10 text-destructive">
          <CardHeader>
            <CardTitle>Unable to load account</CardTitle>
            <CardDescription className="text-destructive">
              {error ?? "We couldn't load your account information."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={() => refresh()}>
              Try again
            </Button>
          </CardFooter>
        </Card>
      </AppLayout>
    );
  }

  if (!accountId) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>Select an account</CardTitle>
            <CardDescription>
              Choose an account to view and manage riders.
            </CardDescription>
          </CardHeader>
        </Card>
      </AppLayout>
    );
  }

  const isLoadingState = isLoading || isFetching;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-guard-900">
              Riders
            </h1>
            <p className="text-guard-500">
              Manage the riders associated with this account.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="include-inactive" className="text-sm text-muted-foreground">
              Include inactive
            </Label>
            <Switch
              id="include-inactive"
              checked={includeInactive}
              onCheckedChange={setIncludeInactive}
            />
          </div>
        </div>

        {ridersError && (
          <Alert variant="destructive">
            <AlertTitle>Unable to load riders</AlertTitle>
            <AlertDescription>
              {ridersError.message ?? "Check your connection and try again."}
            </AlertDescription>
          </Alert>
        )}

        <RiderList
          riders={riders}
          isLoading={isLoadingState}
          error={ridersError?.message}
        />

        <Card>
          <CardHeader>
            <CardTitle>Add a rider</CardTitle>
            <CardDescription>
              Owners and managers can create new riders for this account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canManage ? (
              <CreateRiderForm accountId={accountId} />
            ) : (
              <Alert>
                <AlertTitle>View-only access</AlertTitle>
                <AlertDescription>
                  You can view riders but need owner or manager permissions to add
                  new ones.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
