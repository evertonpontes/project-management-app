"use server";

import { authClient } from "@/lib/safe-action";
import { createSubtask } from "../types";
import { RoleTypes } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const createSubtaskAction = authClient
    .inputSchema(createSubtask)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { taskId, title, isCompleted, order, startDate, dueDate } = parsedInput;

        const subtask = await prisma.$transaction(async (tx) => {
            const task = await tx.task.findUnique({
                where: { id: taskId },
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
                    "You do not have permission to add subtasks to this task."
                );
            }

            // Determine order
            let newOrder = order;
            if (newOrder === undefined) {
                const lastSubtask = await tx.subtask.findFirst({
                    where: { taskId },
                    orderBy: { order: "desc" },
                });
                newOrder = lastSubtask ? lastSubtask.order + 1 : 1;
            }

            const effectiveStartDate = startDate ?? task.startDate ?? new Date();
            const effectiveDueDate = dueDate ?? task.dueDate ?? new Date();

            const created = await tx.subtask.create({
                data: {
                    taskId,
                    title: title.trim(),
                    isCompleted: Boolean(isCompleted),
                    order: newOrder,
                    startDate: effectiveStartDate,
                    dueDate: effectiveDueDate,
                    completedAt: isCompleted ? new Date() : null,
                },
            });

            return created;
        });

        return {
            success: true,
            subtask,
        };
    });
