import { QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/dal";
import { getAllWorkspaces } from "@/features/workspace/actions/get-all-workspaces";

const WorkspacesPage = async () => {
  const queryClient = new QueryClient();

  const user = await queryClient.fetchQuery({
    queryKey: ["current"],
    queryFn: getUser,
  });

  const workspaces = await queryClient.fetchQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspaces,
  });

  if (!user) redirect("/sign-in");

  if (!workspaces || workspaces.data.total === 0) redirect("/new-workspace");

  if (workspaces.data.total > 0)
    redirect(`/workspace/${workspaces.data.rows[0].$id}`);
};

export default WorkspacesPage;
