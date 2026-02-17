import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getLoggedInUser } from "@/features/auth/actions/get-current";
import { getWorkspaces } from "@/features/workspace/actions/get-workspaces";
import { asyncComponent } from "@/lib/async-component";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface DashboardProviderProps {
  children: React.ReactNode;
}

const DashboardProvider = asyncComponent(
  async ({ children }: DashboardProviderProps) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 3,
        },
      },
    });

    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["current"],
        queryFn: () => getLoggedInUser(),
      }),
      queryClient.prefetchQuery({
        queryKey: ["workspaces"],
        queryFn: () => getWorkspaces(),
      }),
    ]);

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main className="flex min-h-svh flex-col w-full">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </HydrationBoundary>
    );
  },
);

export default DashboardProvider;
