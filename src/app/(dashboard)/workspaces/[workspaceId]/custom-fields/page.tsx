import Link from "next/link";
import { redirect } from "next/navigation";
import { QueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/features/auth/queries/get-current";
import { CustomFieldsList } from "@/features/task-field/components/custom-fields-list";

interface CustomFieldsPageProps {
  params: Promise<{ workspaceId: string }>;
}

const CustomFieldsPage = async ({ params }: CustomFieldsPageProps) => {
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
          Custom Fields
        </h1>
      </div>
      <div className="w-full p-6 md:p-8">
        <CustomFieldsList />
      </div>
    </main>
  );
};

export default CustomFieldsPage;
