"use server";

import { authClient } from "@/lib/safe-action";
import { createProject } from "../types";
import { RoleTypes } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const createProjectAction = authClient
    .inputSchema(createProject)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { name, workspaceId, startDate, dueDate } = parsedInput;

        const project = await prisma.$transaction(async (tx) => {
            const workspace = await tx.workspace.findUnique({
                where: {
                    id: workspaceId,
                },
            });

            if (!workspace) {
                throw new Error("Workspace not found");
            }

            const workspaceMember = await tx.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: auth.user.id,
                        workspaceId,
                    },
                },
            });

            if (!workspaceMember) {
                throw new Error("You are not a member of this workspace");
            }

            if (
                workspace.ownerId !== auth.user.id &&
                workspaceMember.role !== RoleTypes.ADMIN &&
                workspaceMember.role !== RoleTypes.PROJECT_MANAGER
            ) {
                throw new Error(
                    "You do not have permission to create a project in this workspace"
                );
            }

            const newProject = await tx.project.create({
                data: {
                    name,
                    workspaceId,
                    startDate,
                    dueDate,
                    ownerId: auth.user.id,
                    projectMembers: {
                        create: {
                            userId: auth.user.id,
                            role: RoleTypes.ADMIN,
                        },
                    },
                },
            });

            return newProject;
        });

        return {
            project,
        };
    });
