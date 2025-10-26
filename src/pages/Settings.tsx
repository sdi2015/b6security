import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, KeyRound, Users } from "lucide-react";

export default function Settings() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-guard-900">Settings</h1>
          <p className="text-guard-500">
            Configure account-wide policies, notifications, and integrations for the B6 Security platform.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Access control
              </CardTitle>
              <CardDescription>Role-based permissions synced with Supabase policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-guard-600">
              <p>• Map employees to guard, supervisor, manager, or client roles.</p>
              <p>• Restrict field portal access with device enrollment.</p>
              <p>• Audit recent sign-ins and enforce MFA.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" /> Integrations
              </CardTitle>
              <CardDescription>Connect dispatch, HRIS, and incident response tools.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-guard-600">
              <p>• Webhook delivery for critical incidents.</p>
              <p>• Schedule sync with external workforce platforms.</p>
              <p>• API keys for data warehouse exports.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" /> Compliance checklist
            </CardTitle>
            <CardDescription>Pending configuration items before go-live.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-guard-600">
            <div>
              <p className="font-medium text-guard-900">Supabase row-level security</p>
              <p>Confirm guard, site, incident, and report tables have RLS policies aligned to client accounts.</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium text-guard-900">Notification routing</p>
              <p>Assign escalation contacts per site and verify SMS/email providers.</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium text-guard-900">Document retention</p>
              <p>Define report retention and auto-archive rules with legal.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
