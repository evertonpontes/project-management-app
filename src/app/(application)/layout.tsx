import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getUser } from "@/lib/dal";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = async ({ children }: WorkspaceLayoutProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["current"],
    queryFn: getUser,
  });

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
};

export default WorkspaceLayout;
