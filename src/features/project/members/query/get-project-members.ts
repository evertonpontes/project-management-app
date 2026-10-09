"use server";

import { PaginationInput } from "@/features/project/base/types";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import type { GetProjectMembersResponse } from "../types";

export async function getProjectMembers(
    projectId: string,
    { page = 1, rowSize = 10 }: PaginationInput = {}
): Promise<GetProjectMembersResponse> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const { user } = session;

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            workspace: true,
            projectMembers: {
                where: { userId: user.id },
            },
        },
    });

    if (!project) {
        throw new Error("Project not found");
    }

    const workspaceMember = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: user.id,
                workspaceId: project.workspaceId,
            },
        },
    });

    if (!workspaceMember) {
        throw new Error("You are not a member of this workspace");
    }

    const isWorkspaceOwner = project.workspace.ownerId === user.id;
    const isWorkspaceAdmin = workspaceMember.role === "ADMIN";
    const isProjectOwner = project.ownerId === user.id;
    const isProjectMember = project.projectMembers.length > 0;

    if (
        !isWorkspaceOwner &&
        !isWorkspaceAdmin &&
        !isProjectOwner &&
        !isProjectMember
    ) {
        throw new Error("You do not have permission to view members of this project");
    }

    const skip = (page - 1) * rowSize;

    const [projectMembers, total] = await Promise.all([
        prisma.projectMember.findMany({
            where: {
                projectId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        createdAt: true,
                    },
                },
            },
            skip,
            take: rowSize,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.projectMember.count({
            where: {
                projectId,
            },
        }),
    ]);

    const totalPages = Math.ceil(total / rowSize);

    return {
        projectMembers,
        pagination: {
            page,
            rowSize,
            total,
            totalPages,
        },
    };
}
