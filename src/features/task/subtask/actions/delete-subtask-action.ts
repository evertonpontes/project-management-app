"use server";

import { authClient } from "@/lib/safe-action";
import { deleteSubtask } from "../types";
import { RoleTypes } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const deleteSubtaskAction = authClient
    .inputSchema(deleteSubtask)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { id } = parsedInput;

        const result = await prisma.$transaction(async (tx) => {
            const subtask = await tx.subtask.findUnique({
                where: { id },
                include: {
                    task: {
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
                    },
                },
            });

            if (!subtask) {
                throw new Error("Subtask not found");
            }

            const { task } = subtask;

            // Permissions check: task owner, assigned user, project owner, workspace owner, or admins
            const isTaskOwner = task.createdById === auth.user.id;
            const isAssignedUser = task.assignedToId === auth.user.id;
            const isProjectOwner = task.project.ownerId === auth.user.id;
            const isWorkspaceOwner = task.project.workspace.ownerId === auth.user.id;

            const workspaceMember = task.project.workspace.workspaceMembers[0];
            const isWorkspaceAdmin =
                workspaceMember?.role === RoleTypes.ADMIN ||
                workspaceMember?.role === RoleTypes.PROJECT_MANAGER;

            const projectMember = task.project.projectMembers[0];
            const isProjectAdmin =
                projectMember?.role === RoleTypes.ADMIN ||
                projectMember?.role === RoleTypes.PROJECT_MANAGER;

            const canManage =
                isTaskOwner ||
                isAssignedUser ||
                isProjectOwner ||
                isWorkspaceOwner ||
                isWorkspaceAdmin ||
                isProjectAdmin;

            if (!canManage) {
                throw new Error(
                    "You do not have permission to delete this subtask."
                );
            }

            await tx.subtask.delete({
                where: { id },
            });

            return {
                id: subtask.id,
                taskId: subtask.taskId,
            };
        });

        return {
            success: true,
            id: result.id,
            taskId: result.taskId,
        };
    });
