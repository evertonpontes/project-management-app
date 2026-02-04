import { QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/dal";
import { Header } from "@/components/header";
import { WorkspaceForm } from "@/features/workspace/components/workspace-form";

const WorkspacePage = async () => {
  const queryClient = new QueryClient();

  const user = await queryClient.fetchQuery({
    queryKey: ["current"],
    queryFn: getUser,
  });

  if (!user) redirect("/sign-in");

  return (
    <main className="flex h-full min-h-svh flex-col w-full">
      <Header />
      <div className="flex items-center justify-center w-full h-full grow ">
        <WorkspaceForm />
      </div>
    </main>
  );
};

export default WorkspacePage;
