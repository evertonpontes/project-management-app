import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RiLoader4Line } from "@remixicon/react";

import { auth } from "@/lib/auth";
import { getWorkspaceById } from "@/features/workspace";

interface WorkspaceIdContentProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

async function WorkspaceIdContent({ params }: WorkspaceIdContentProps) {
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
        <div className="flex flex-col flex-1 p-6">
            <h1 className="font-bold text-2xl tracking-tight">{workspace.name}</h1>
        </div>
    );
}

function WorkspaceIdLoading() {
    return (
        <div className="flex flex-1 justify-center items-center p-8 min-h-[50vh]">
            <RiLoader4Line className="size-6 text-muted-foreground animate-spin" />
        </div>
    );
}

interface WorkspaceIdPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default function WorkspaceIdPage({ params }: WorkspaceIdPageProps) {
    return (
        <Suspense fallback={<WorkspaceIdLoading />}>
            <WorkspaceIdContent params={params} />
        </Suspense>
    );
}