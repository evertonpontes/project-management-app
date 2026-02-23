import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/features/auth/queries/get-current";
import { MembersList } from "@/features/member/components/members-list";
import { getWorkspaceById } from "@/features/workspace/queries/get-workspace-by-id";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { redirect } from "next/navigation";

interface MembersPageProps {
  params: Promise<{ workspaceId: string }>;
}

const MembersPagePage = async ({ params }: MembersPageProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 3,
      },
    },
  });
  const { workspaceId } = await params;

  const user = await queryClient.fetchQuery({
    queryKey: ["current"],
    queryFn: getLoggedInUser,
  });

  if (!user.data) {
    redirect("/login");
  }

  const workspace = await getWorkspaceById({ workspaceId });

  if (!workspace.data) {
    redirect(`/workspaces/${workspaceId}`);
  }

  return (
    <main className="flex flex-1 flex-col w-full items-center bg-muted">
      <div className="flex items-center gap-4 w-full bg-card border-b border-foreground/10 h-18 px-8 py-6">
        <Button
          variant="secondary"
          size="sm"
          nativeButton={false}
          render={
            <Link href={`/workspaces/${workspaceId}`}>
              <ArrowLeftIcon />
              Back
            </Link>
          }
        ></Button>

        <h1 className="text-3xl tracking-tight font-semibold text-foreground">
          Members
        </h1>
      </div>
      <div className="w-full p-6 md:p-8">
        <MembersList />
      </div>
    </main>
  );
};

export default MembersPagePage;
