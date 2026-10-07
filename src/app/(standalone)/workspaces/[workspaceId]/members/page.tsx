import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { WorkspaceMemberPanel } from "@/features/workspace/members";
import WorkspaceSettingsLoading from "./loading";
import { getWorkspaceById } from "@/features/workspace";

interface WorkspaceMembersContentProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

async function WorkspaceMembersContent({
    params,
}: WorkspaceMembersContentProps) {
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
        <WorkspaceMemberPanel
            workspaceId={workspaceId}
            currentUserId={session.user.id}
            className="p-8 md:p-10"
        />
    );
}

interface WorkspaceMembersPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default function WorkspaceMembersPage({
    params,
}: WorkspaceMembersPageProps) {
    return (
        <Suspense fallback={<WorkspaceSettingsLoading />}>
            <WorkspaceMembersContent params={params} />
        </Suspense>
    );
}
