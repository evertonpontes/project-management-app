"use server";

import { authClient } from "@/lib/safe-action";
import { deleteProject } from "../types";
import { RoleTypes } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const deleteProjectAction = authClient
    .inputSchema(deleteProject)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { id } = parsedInput;

        await prisma.$transaction(async (tx) => {
            const project = await tx.project.findUnique({
                where: { id },
                include: {
                    workspace: true,
                    projectMembers: {
                        where: { userId: auth.user.id },
                    },
                },
            });

            if (!project) {
                throw new Error("Project not found");
            }

            const workspaceMember = await tx.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: auth.user.id,
                        workspaceId: project.workspaceId,
                    },
                },
            });

            if (!workspaceMember) {
                throw new Error("You are not a member of this workspace");
            }

            const isWorkspaceOwner = project.workspace.ownerId === auth.user.id;
            const isWorkspaceAdminOrPM =
                workspaceMember.role === RoleTypes.ADMIN ||
                workspaceMember.role === RoleTypes.PROJECT_MANAGER;
            const isProjectOwner = project.ownerId === auth.user.id;
            const projectMember = project.projectMembers[0];
            const isProjectAdmin =
                projectMember?.role === RoleTypes.ADMIN ||
                projectMember?.role === RoleTypes.PROJECT_MANAGER;

            const hasPermission =
                isWorkspaceOwner ||
                isWorkspaceAdminOrPM ||
                isProjectOwner ||
                isProjectAdmin;

            if (!hasPermission) {
                throw new Error(
                    "You do not have permission to delete this project"
                );
            }

            await tx.project.delete({
                where: { id },
            });
        });

        return {
            success: true,
            id,
        };
    });
