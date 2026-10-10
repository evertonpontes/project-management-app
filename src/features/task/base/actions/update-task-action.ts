"use server";

import { authClient } from "@/lib/safe-action";
import { updateTask } from "../types";
import { TaskStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const updateTaskAction = authClient
    .inputSchema(updateTask)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const {
            id,
            title,
            description,
            type,
            status,
            priority,
            startDate,
            dueDate,
            assignedToId,
        } = parsedInput;

        const task = await prisma.$transaction(async (tx) => {
            const existingTask = await tx.task.findUnique({
                where: { id },
                include: {
                    project: {
                        include: {
                            workspace: true,
                            projectMembers: true,
                        },
                    },
                },
            });

            if (!existingTask) {
                throw new Error("Task not found");
            }

            // Permissions check: only the task owner or the assigned user (or project owner) can update
            const isTaskOwner = existingTask.createdById === auth.user.id;
            const isAssignedUser = existingTask.assignedToId === auth.user.id;
            const isProjectOwner = existingTask.project.ownerId === auth.user.id;

            if (!isTaskOwner && !isAssignedUser && !isProjectOwner) {
                throw new Error("Only the task creator or assigned user can update this task");
            }

            // Validate assignee if provided and changed
            if (assignedToId && assignedToId !== existingTask.assignedToId) {
                const assignedUser = await tx.user.findUnique({
                    where: { id: assignedToId },
                });

                if (!assignedUser) {
                    throw new Error("Assigned user does not exist");
                }

                const isAssignedInProject = existingTask.project.projectMembers.some(
                    (m) => m.userId === assignedToId
                );
                const isAssignedInWorkspace = await tx.workspaceMember.findUnique({
                    where: {
                        userId_workspaceId: {
                            userId: assignedToId,
                            workspaceId: existingTask.project.workspaceId,
                        },
                    },
                });

                if (
                    !isAssignedInProject &&
                    !isAssignedInWorkspace &&
                    existingTask.project.ownerId !== assignedToId
                ) {
                    throw new Error("Assigned user must be a member of this workspace or project");
                }
            }

            const updatedTask = await tx.task.update({
                where: { id },
                data: {
                    ...(title !== undefined && { title }),
                    ...(description !== undefined && { description: description || null }),
                    ...(type !== undefined && { type }),
                    ...(status !== undefined && {
                        status,
                        completedAt: status === TaskStatus.DONE ? new Date() : null,
                    }),
                    ...(priority !== undefined && { priority }),
                    ...(startDate !== undefined && {
                        startDate: startDate ? new Date(startDate) : null,
                    }),
                    ...(dueDate !== undefined && {
                        dueDate: dueDate ? new Date(dueDate) : null,
                    }),
                    ...(assignedToId !== undefined && {
                        assignedToId: assignedToId || null,
                    }),
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                    assignedTo: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                    project: {
                        select: {
                            id: true,
                            name: true,
                            workspaceId: true,
                        },
                    },
                    subTasks: {
                        orderBy: { order: "asc" },
                    },
                },
            });

            return updatedTask;
        });

        return {
            task,
        };
    });
