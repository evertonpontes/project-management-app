"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { ProjectItem } from "../types";

export async function getProjectById(
    projectId: string,
    workspaceId?: string
): Promise<ProjectItem> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            workspace: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                    ownerId: true,
                },
            },
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            projectMembers: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            },
            tasks: {
                select: {
                    id: true,
                    title: true,
                    status: true,
                    priority: true,
                    dueDate: true,
                },
            },
            _count: {
                select: {
                    tasks: true,
                    projectMembers: true,
                },
            },
        },
    });

    if (!project) {
        throw new Error("Project not found");
    }

    if (workspaceId && project.workspaceId !== workspaceId) {
        throw new Error("Project does not belong to this workspace");
    }

    const workspaceMember = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: session.user.id,
                workspaceId: project.workspaceId,
            },
        },
    });

    if (!workspaceMember) {
        throw new Error("You are not a member of this workspace");
    }

    const isWorkspaceOwner = project.workspace.ownerId === session.user.id;
    const isWorkspaceAdmin = workspaceMember.role === "ADMIN";
    const isProjectOwner = project.ownerId === session.user.id;
    const isProjectMember = project.projectMembers.some(
        (m) => m.userId === session.user.id
    );

    if (
        !isWorkspaceOwner &&
        !isWorkspaceAdmin &&
        !isProjectOwner &&
        !isProjectMember
    ) {
        throw new Error("You do not have permission to access this project");
    }

    const isDone =
        project.tasks.length > 0 &&
        project.tasks.every((t) => t.status === "DONE");

    return {
        ...project,
        isDone,
    };
}
