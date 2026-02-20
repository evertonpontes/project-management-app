import { getLoggedInUser } from "@/features/auth/queries/get-current";
import { getWorkspaceInfo } from "@/features/workspace/queries/get-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspace/components/join-workspace-form";
import { QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getMember } from "@/features/member/queries/get-member";

interface JoinWorkspacePageProps {
  params: Promise<{ workspaceId: string; inviteCode: string }>;
}

const JoinWorkspacePage = async ({ params }: JoinWorkspacePageProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 3,
      },
    },
  });

  const { workspaceId, inviteCode } = await params;

  const user = await queryClient.fetchQuery({
    queryKey: ["current"],
    queryFn: getLoggedInUser,
  });

  const workspace = await getWorkspaceInfo({ workspaceId });

  if (!user.data) {
    redirect("/login");
  }

  if (!workspace.data) {
    redirect("/workspaces");
  }

  const member = await getMember({ userId: user.data?.$id, workspaceId });

  if (member) {
    redirect("/workspaces");
  }

  return (
    <main className="flex flex-1 flex-col w-full items-center justify-center bg-muted">
      <div className="w-full max-w-2xl p-6 md:p-8">
        <JoinWorkspaceForm
          workspaceName={workspace.data.workspaceName}
          workspaceId={workspaceId}
          code={inviteCode}
        />
      </div>
    </main>
  );
};
export default JoinWorkspacePage;
