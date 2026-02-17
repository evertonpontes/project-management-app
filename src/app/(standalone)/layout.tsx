import { Suspense } from "react";
import DashboardProvider from "@/components/dashboard-provider";
import { DashboardLoading } from "@/components/dashboard-loading";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardProvider children={children} />
    </Suspense>
  );
};

export default StandaloneLayout;
