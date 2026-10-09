import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RiTaskLine } from "@remixicon/react";

import { auth } from "@/lib/auth";
import { getWorkspaceById } from "@/features/workspace";
import { getProjectById, ProjectDetailsHeader } from "@/features/project";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectContentProps {
    params: Promise<{
        workspaceId: string;
        projectId: string;
    }>;
}

function ProjectDetailsLoading() {
    return (
        <div className="flex flex-col flex-1 p-6 md:p-8 space-y-6" data-slot="project-page-loading">
            {/* Top navigation skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-16 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>
            </div>

            {/* Header details skeleton */}
            <div className="flex items-start gap-4">
                <Skeleton className="size-12 rounded-xl shrink-0" />
                <div className="space-y-2 w-full max-w-md">
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3.5 w-72" />
                </div>
            </div>

            {/* Metrics cards skeleton */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
            </div>

            {/* Content card skeleton */}
            <Card className="border-border/80 bg-card">
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-80" />
                    </div>
                    <Skeleton className="h-48 w-full rounded-lg" />
                </CardContent>
            </Card>
        </div>
    );
}

async function ProjectPageContent({ params }: ProjectContentProps) {
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
        <div className="flex flex-col flex-1 p-6 md:p-8 space-y-6" data-slot="project-page">
            <ProjectDetailsHeader project={project} workspaceId={workspaceId} />

            {/* Project Content Section */}
            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-2xs space-y-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                        Project Tasks & Activities
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Manage, assign, and track all tasks, milestones, and deliverables for {project.name}.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 py-12 px-4 text-center">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3 shadow-2xs">
                        <RiTaskLine className="size-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                        Tasks board and view coming soon
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                        You will be able to create tasks, organize columns, assign team members, and track progress here.
                    </p>
                </div>
            </div>
        </div>
    );
}

interface ProjectPageProps {
    params: Promise<{
        workspaceId: string;
        projectId: string;
    }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
    return (
        <Suspense fallback={<ProjectDetailsLoading />}>
            <ProjectPageContent params={params} />
        </Suspense>
    );
}
