import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getWorkspaceById, SettingsWorkspace } from "@/features/workspace";
import WorkspaceSettingsLoading from "./loading";

interface WorkspaceSettingsContentProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

async function WorkspaceSettingsContent({ params }: WorkspaceSettingsContentProps) {
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

    return <SettingsWorkspace workspace={workspace} workspaceId={workspaceId} />;
}

interface WorkspaceSettingsPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default function WorkspaceSettingsPage({ params }: WorkspaceSettingsPageProps) {
    return (
        <Suspense fallback={<WorkspaceSettingsLoading />}>
            <WorkspaceSettingsContent params={params} />
        </Suspense>
    );
}