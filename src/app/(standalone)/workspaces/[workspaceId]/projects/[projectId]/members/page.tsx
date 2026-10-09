import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getWorkspaceById } from "@/features/workspace";
import { getProjectById, ProjectMemberPanel } from "@/features/project";
import ProjectMembersLoading from "./loading";

interface ProjectMembersContentProps {
    params: Promise<{
        workspaceId: string;
        projectId: string;
    }>;
}

async function ProjectMembersContent({
    params,
}: ProjectMembersContentProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const { workspaceId, projectId } = await params;

    let workspace = null;
    try {
        workspace = await getWorkspaceById(workspaceId);
    } catch {
        workspace = null;
    }

    if (!workspace) {
        redirect("/workspaces");
    }

    let project = null;
    try {
        project = await getProjectById(projectId, workspaceId);
    } catch {
        project = null;
    }

    if (!project) {
        redirect(`/workspaces/${workspaceId}/projects`);
    }

    return (
        <ProjectMemberPanel
            projectId={projectId}
            workspaceId={workspaceId}
            currentUserId={session.user.id}
            className="p-8 md:p-10"
        />
    );
}

interface ProjectMembersPageProps {
    params: Promise<{
        workspaceId: string;
        projectId: string;
    }>;
}

export default function ProjectMembersPage({
    params,
}: ProjectMembersPageProps) {
    return (
        <Suspense fallback={<ProjectMembersLoading />}>
            <ProjectMembersContent params={params} />
        </Suspense>
    );
}
