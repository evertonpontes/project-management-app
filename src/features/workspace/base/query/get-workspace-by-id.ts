"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getWorkspaceById(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const isMember = await prisma.workspaceMember.findFirst({
        where: {
            userId: session.user.id,
            workspaceId: id,
        },
    });

    if (!isMember) {
        throw new Error("You are not a member of this workspace");
    }

    const workspace = await prisma.workspace.findUnique({
        where: {
            id,
        },
    });

    if (!workspace) {
        throw new Error("Workspace not found");
    }

    return workspace;
}
