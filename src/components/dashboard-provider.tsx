import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getLoggedInUser } from "@/features/auth/actions/get-current";
import { getWorkspaces } from "@/features/workspace/actions/get-workspaces";
import { CreateWorkspaceModal } from "@/features/workspace/components/create-workspace-modal";
import { asyncComponent } from "@/lib/async-component";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Button } from "./ui/button";
import { BellIcon } from "@phosphor-icons/react/dist/ssr";

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
        <CreateWorkspaceModal />
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className=" sticky top-0 w-full bg-card shadow-xs">
              <nav className="flex w-full items-center justify-between p-2">
                <SidebarTrigger />

                <Button variant="ghost" size="icon">
                  <BellIcon className="size-5 text-card-foreground/85" />
                </Button>
              </nav>
            </header>
            <main className="flex h-full grow flex-col w-full">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </HydrationBoundary>
    );
  },
);

export default DashboardProvider;
