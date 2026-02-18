import { QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "@/features/auth/actions/get-current";
import { getWorkspaces } from "@/features/workspace/actions/get-workspaces";

const WorkspacesPage = async () => {
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

  const workspaces = await queryClient.fetchQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  if (!user.data) {
    redirect("/login");
  }

  if (!workspaces.data?.total) {
    redirect("/workspaces/create");
  }

  redirect(`/workspaces/${workspaces.data.rows[0].$id}`);
};

export default WorkspacesPage;
