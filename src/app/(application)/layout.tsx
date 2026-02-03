import { getUser } from "@/lib/dal";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

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
      {children}
    </HydrationBoundary>
  );
};

export default WorkspaceLayout;
