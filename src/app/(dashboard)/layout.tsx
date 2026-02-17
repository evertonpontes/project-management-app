import { Suspense } from "react";
import DashboardProvider from "@/components/dashboard-provider";
import { DashboardLoading } from "@/components/dashboard-loading";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardProvider children={children} />
    </Suspense>
  );
};

export default DashboardLayout;
