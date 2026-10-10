"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RoleTypes } from "@/generated/prisma/enums";
import type { SubtaskItem } from "../types";

export async function getSubtasks(taskId: string): Promise<SubtaskItem[]> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
            project: {
                include: {
                    workspace: {
                        include: {
                            workspaceMembers: {
                                where: { userId: session.user.id },
                            },
                        },
                    },
                    projectMembers: {
                        where: { userId: session.user.id },
                    },
                },
            },
        },
    });

    if (!task) {
        throw new Error("Task not found");
    }

    const isWorkspaceOwner = task.project.workspace.ownerId === session.user.id;
    const isProjectOwner = task.project.ownerId === session.user.id;
    const isTaskOwner = task.createdById === session.user.id;
    const isAssignedUser = task.assignedToId === session.user.id;

    const workspaceMember = task.project.workspace.workspaceMembers[0];
    const isWorkspaceAdmin =
        workspaceMember?.role === RoleTypes.ADMIN ||
        workspaceMember?.role === RoleTypes.PROJECT_MANAGER;

    const projectMember = task.project.projectMembers[0];
    const isProjectMember = Boolean(projectMember);

    const hasAccess =
        isWorkspaceOwner ||
        isProjectOwner ||
        isTaskOwner ||
        isAssignedUser ||
        isWorkspaceAdmin ||
        isProjectMember;

    if (!hasAccess) {
        throw new Error("You do not have access to this task's subtasks");
    }

    const subtasks = await prisma.subtask.findMany({
        where: { taskId },
        orderBy: { order: "asc" },
    });

    return subtasks;
}
