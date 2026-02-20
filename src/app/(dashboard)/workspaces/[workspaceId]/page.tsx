import { getLoggedInUser } from "@/features/auth/queries/get-current";
import { QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";

interface WorkspaceIdProps {
  params: Promise<{ workspaceId: string }>;
}

const WorkspaceIdPage = async ({ params }: WorkspaceIdProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 3,
      },
    },
  });

  const user = await queryClient.fetchQuery({
    queryKey: ["current"],
    queryFn: getLoggedInUser,
  });

  if (!user.data) {
    redirect("/login");
  }

  return <div className="flex flex-1 w-full bg-muted">Enter</div>;
};

export default WorkspaceIdPage;
