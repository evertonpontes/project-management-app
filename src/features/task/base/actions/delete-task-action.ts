"use server";

import { authClient } from "@/lib/safe-action";
import { deleteTask } from "../types";
import { RoleTypes } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const deleteTaskAction = authClient
    .inputSchema(deleteTask)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { id } = parsedInput;

        const deletedTask = await prisma.$transaction(async (tx) => {
            const task = await tx.task.findUnique({
                where: { id },
                include: {
                    project: {
                        include: {
                            workspace: {
                                include: {
                                    workspaceMembers: {
                                        where: { userId: auth.user.id },
                                    },
                                },
                            },
                            projectMembers: {
                                where: { userId: auth.user.id },
                            },
                        },
                    },
                },
            });

            if (!task) {
                throw new Error("Task not found");
            }

            // Permissions check:
            // 1. Task owner (the user who created the task)
            const isTaskOwner = task.createdById === auth.user.id;

            // 2. Workspace owner
            const isWorkspaceOwner = task.project.workspace.ownerId === auth.user.id;

            // 3. Project owner
            const isProjectOwner = task.project.ownerId === auth.user.id;

            // 4. Workspace admin or project manager
            const workspaceMember = task.project.workspace.workspaceMembers[0];
            const isWorkspaceAdmin =
                workspaceMember?.role === RoleTypes.ADMIN ||
                workspaceMember?.role === RoleTypes.PROJECT_MANAGER;

            // 5. Project admin or project manager
            const projectMember = task.project.projectMembers[0];
            const isProjectAdmin =
                projectMember?.role === RoleTypes.ADMIN ||
                projectMember?.role === RoleTypes.PROJECT_MANAGER;

            const hasPermission =
                isTaskOwner ||
                isWorkspaceOwner ||
                isProjectOwner ||
                isWorkspaceAdmin ||
                isProjectAdmin;

            if (!hasPermission) {
                throw new Error(
                    "You do not have permission to delete this task. Only the task owner, admins, or workspace owner can delete tasks."
                );
            }

            await tx.task.delete({
                where: { id },
            });

            return {
                id: task.id,
                projectId: task.projectId,
            };
        });

        return {
            success: true,
            id: deletedTask.id,
            projectId: deletedTask.projectId,
        };
    });
