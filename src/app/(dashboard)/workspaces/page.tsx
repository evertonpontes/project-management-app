import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { UserButton } from "@/components/user-button";
import WorkspacesLoading from "./loading";

async function WorkspacesContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <div>
            <UserButton />
            Workspaces Page
        </div>
    );
}

export default function WorkspacesPage() {
    return (
        <Suspense fallback={<WorkspacesLoading />}>
            <WorkspacesContent />
        </Suspense>
    );
}