"use server";

import { PaginationInput } from "@/features/workspace";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getWorkspaceMembers(
    workspaceId: string,
    { page = 1, rowSize = 10 }: PaginationInput = {}
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const { user } = session;

    const workspaceMember = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: user.id,
                workspaceId,
            },
        },
        include: {
            workspace: true,
        },
    });

    if (!workspaceMember) {
        throw new Error("You are not a member of this workspace");
    }

    const skip = (page - 1) * rowSize;

    const [workspaceMembers, total] = await Promise.all([
        prisma.workspaceMember.findMany({
            where: {
                workspaceId,
            },
            include: {
                user: true,
            },
            skip,
            take: rowSize,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.workspaceMember.count({
            where: {
                workspaceId,
            },
        }),
    ]);

    const totalPages = Math.ceil(total / rowSize);

    return {
        workspaceMembers,
        pagination: {
            page,
            rowSize,
            total,
            totalPages,
        },
    };
}
