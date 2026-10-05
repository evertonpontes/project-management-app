import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getWorkspaces } from "@/features/workspace";
import WorkspacesLoading from "./loading";

async function getLatestWorkspace() {
    const { workspaces } = await getWorkspaces({
        page: 1,
        rowSize: 1,
    });

    return workspaces[0] ?? null;
}

async function WorkspacesContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const latestWorkspace = await getLatestWorkspace();

    if (latestWorkspace) {
        redirect(`/workspaces/${latestWorkspace.id}`);
    }

    redirect("/workspaces/create");

    return null;
}

export default function WorkspacesPage() {
    return (
        <Suspense fallback={<WorkspacesLoading />}>
            <WorkspacesContent />
        </Suspense>
    );
}