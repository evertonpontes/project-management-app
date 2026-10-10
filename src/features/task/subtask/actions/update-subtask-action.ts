"use server";

import { authClient } from "@/lib/safe-action";
import { updateSubtask } from "../types";
import { RoleTypes } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const updateSubtaskAction = authClient
    .inputSchema(updateSubtask)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { id, title, isCompleted, order, startDate, dueDate } = parsedInput;

        const subtask = await prisma.$transaction(async (tx) => {
            const existingSubtask = await tx.subtask.findUnique({
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

            if (!existingSubtask) {
                throw new Error("Subtask not found");
            }

            const { task } = existingSubtask;

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
                    "You do not have permission to update subtasks for this task."
                );
            }

            const updated = await tx.subtask.update({
                where: { id },
                data: {
                    ...(title !== undefined && { title: title.trim() }),
                    ...(isCompleted !== undefined && {
                        isCompleted,
                        completedAt: isCompleted
                            ? existingSubtask.completedAt ?? new Date()
                            : null,
                    }),
                    ...(order !== undefined && { order }),
                    ...(startDate !== undefined && {
                        startDate: startDate ?? existingSubtask.startDate,
                    }),
                    ...(dueDate !== undefined && {
                        dueDate: dueDate ?? existingSubtask.dueDate,
                    }),
                },
            });

            return updated;
        });

        return {
            success: true,
            subtask,
        };
    });
