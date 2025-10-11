import { Link, useParams } from "react-router-dom";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount } from "@/context/AccountContext";
import { useRider } from "@/features/riders/hooks";
import { UpdateRiderForm } from "@/features/riders/components/RiderForm";

const skeleton = (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  </div>
);

export default function RiderProfile() {
  const { id } = useParams();
  const { accountId, role, status, error, refresh } = useAccount();
  const {
    data: rider,
    isLoading,
    error: riderError,
  } = useRider(accountId, id ?? null);

  const canEdit = role === "owner" || role === "manager";

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
            <CardTitle>No account selected</CardTitle>
            <CardDescription>
              Sign in or switch to an account to view rider details.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/riders">Back to riders</Link>
            </Button>
          </CardFooter>
        </Card>
      </AppLayout>
    );
  }

  if (isLoading) {
    return <AppLayout>{skeleton}</AppLayout>;
  }

  if (riderError) {
    return (
      <AppLayout>
        <Card className="border-destructive/50 bg-destructive/10 text-destructive">
          <CardHeader>
            <CardTitle>Unable to load rider</CardTitle>
            <CardDescription className="text-destructive">
              {riderError.message}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link to="/riders">Back to riders</Link>
            </Button>
          </CardFooter>
        </Card>
      </AppLayout>
    );
  }

  if (!rider) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>Rider not found</CardTitle>
            <CardDescription>
              This rider may have been removed or you may not have access.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/riders">Back to riders</Link>
            </Button>
          </CardFooter>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-guard-900">
              {rider.full_name}
            </h1>
            <p className="text-guard-500">
              {rider.discipline ?? "No discipline specified"}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/riders">Back to riders</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>
              {rider.is_active ? "Active rider" : "Inactive rider"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Email
              </div>
              <div>{rider.email ?? "Not provided"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Phone
              </div>
              <div>{rider.phone ?? "Not provided"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>
              Keep track of preferences, training updates, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rider.notes ? (
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {rider.notes}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No notes added.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit rider</CardTitle>
            <CardDescription>
              {canEdit
                ? "Update rider details or deactivate access."
                : "You can view this rider but edits require owner or manager access."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateRiderForm
              accountId={accountId}
              rider={rider}
              readOnly={!canEdit}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
