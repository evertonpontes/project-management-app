import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getWorkspaceById } from "@/features/workspace";
import { ProjectPanel } from "@/features/project";
import WorkspaceProjectsLoading from "./loading";

interface WorkspaceProjectsContentProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

async function WorkspaceProjectsContent({
    params,
}: WorkspaceProjectsContentProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const { workspaceId } = await params;

    let workspace = null;
    try {
        workspace = await getWorkspaceById(workspaceId);
    } catch {
        workspace = null;
    }

    if (!workspace) {
        redirect("/workspaces");
    }

    return (
        <div className="flex flex-col flex-1 p-6 md:p-8">
            <ProjectPanel workspaceId={workspaceId} />
        </div>
    );
}

interface WorkspaceProjectsPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default function WorkspaceProjectsPage({
    params,
}: WorkspaceProjectsPageProps) {
    return (
        <Suspense fallback={<WorkspaceProjectsLoading />}>
            <WorkspaceProjectsContent params={params} />
        </Suspense>
    );
}
