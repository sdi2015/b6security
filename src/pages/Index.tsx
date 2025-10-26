
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-guard-900">Command Center</h1>
          <p className="text-guard-500">
            Real-time visibility into guard staffing, incidents, and client-facing reports
          </p>
        </div>
        <DashboardStats />
      </div>
    </AppLayout>
  );
};

export default Index;
