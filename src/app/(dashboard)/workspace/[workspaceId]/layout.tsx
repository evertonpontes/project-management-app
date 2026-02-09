import { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";

import { getAllWorkspaces } from "@/features/workspace/actions/get-all-workspaces";
import { getUser } from "@/lib/dal";
import { DashboardLoading } from "@/components/dashboard-loading";

const asyncComponent = <T, R>(
  fn: (args: T) => Promise<R>,
): ((args: T) => R) => {
  return fn as (args: T) => R;
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const LayoutSuspense = asyncComponent(
  async ({ children }: DashboardLayoutProps) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60,
        },
      },
    });

    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["current"],
        queryFn: getUser,
      }),
      queryClient.prefetchQuery({
        queryKey: ["workspaces"],
        queryFn: getAllWorkspaces,
      }),
    ]);

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full min-h-svh flex flex-col">
            <Header />
            {children}
          </main>
        </SidebarProvider>
      </HydrationBoundary>
    );
  },
);

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <LayoutSuspense>{children}</LayoutSuspense>
    </Suspense>
  );
};

export default DashboardLayout;
