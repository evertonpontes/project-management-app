"use server";

import { authClient } from "@/lib/safe-action";
import { createTask } from "../types";
import { RoleTypes, TaskPriority, TaskStatus, TaskTypes } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const createTaskAction = authClient
    .inputSchema(createTask)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const {
            projectId,
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
            const project = await tx.project.findUnique({
                where: {
                    id: projectId,
                },
                include: {
                    workspace: true,
                    projectMembers: true,
                },
            });

            if (!project) {
                throw new Error("Project not found");
            }

            // Check workspace membership
            const workspaceMember = await tx.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: auth.user.id,
                        workspaceId: project.workspaceId,
                    },
                },
            });

            const isWorkspaceOwner = project.workspace.ownerId === auth.user.id;
            const isWorkspaceAdmin =
                workspaceMember?.role === RoleTypes.ADMIN ||
                workspaceMember?.role === RoleTypes.PROJECT_MANAGER;
            const isProjectOwner = project.ownerId === auth.user.id;
            const currentProjectMember = project.projectMembers.find(
                (m) => m.userId === auth.user.id
            );

            if (!isWorkspaceOwner && !isWorkspaceAdmin && !isProjectOwner && !currentProjectMember) {
                throw new Error("You do not have access to this project");
            }

            // If user is only a VIEWER on the project and not a workspace admin/owner, prevent creation
            if (
                currentProjectMember?.role === RoleTypes.VIEWER &&
                !isWorkspaceOwner &&
                !isWorkspaceAdmin &&
                !isProjectOwner
            ) {
                throw new Error("Viewers do not have permission to create tasks in this project");
            }

            // Validate assignee if provided
            if (assignedToId) {
                const assignedUser = await tx.user.findUnique({
                    where: { id: assignedToId },
                });

                if (!assignedUser) {
                    throw new Error("Assigned user does not exist");
                }

                // Verify assigned user is part of the workspace or project
                const isAssignedInProject = project.projectMembers.some(
                    (m) => m.userId === assignedToId
                );
                const isAssignedInWorkspace = await tx.workspaceMember.findUnique({
                    where: {
                        userId_workspaceId: {
                            userId: assignedToId,
                            workspaceId: project.workspaceId,
                        },
                    },
                });

                if (!isAssignedInProject && !isAssignedInWorkspace && project.ownerId !== assignedToId) {
                    throw new Error("Assigned user must be a member of this workspace or project");
                }
            }

            const newTask = await tx.task.create({
                data: {
                    projectId,
                    title,
                    description: description || null,
                    type: type ?? TaskTypes.TASK,
                    status: status ?? TaskStatus.TODO,
                    priority: priority ?? TaskPriority.MEDIUM,
                    startDate: startDate ? new Date(startDate) : null,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    createdById: auth.user.id,
                    assignedToId: assignedToId || null,
                    completedAt: status === TaskStatus.DONE ? new Date() : null,
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
                    subTasks: true,
                },
            });

            return newTask;
        });

        return {
            task,
        };
    });
