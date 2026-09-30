import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RiLoader4Line } from "@remixicon/react";

import { auth } from "@/lib/auth";
import { CreateWorkspaceForm } from "@/features/workspace";

async function CreateWorkspaceContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <div className="flex flex-col flex-1 justify-center">
            <CreateWorkspaceForm />
        </div>
    );
}

export default function CreateWorkspacePage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center min-h-screen">
                    <RiLoader4Line className="size-6 text-muted-foreground animate-spin" />
                </div>
            }
        >
            <CreateWorkspaceContent />
        </Suspense>
    );
}