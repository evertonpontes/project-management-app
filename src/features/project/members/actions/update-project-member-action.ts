"use server";

import { authClient } from "@/lib/safe-action";
import { updateProjectMember } from "../types";
import { RoleTypes } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const updateProjectMemberAction = authClient
    .inputSchema(updateProjectMember)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { userId, projectId, role } = parsedInput;

        await prisma.$transaction(async (tx) => {
            if (userId === auth.user.id) {
                throw new Error("You cannot update your own role");
            }

            const project = await tx.project.findUnique({
                where: { id: projectId },
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

            const callerWorkspaceMember = await tx.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: auth.user.id,
                        workspaceId: project.workspaceId,
                    },
                },
            });

            if (!callerWorkspaceMember) {
                throw new Error("You are not a member of this workspace");
            }

            const isWorkspaceOwner = project.workspace.ownerId === auth.user.id;
            const isWorkspaceAdminOrPM =
                callerWorkspaceMember.role === RoleTypes.ADMIN ||
                callerWorkspaceMember.role === RoleTypes.PROJECT_MANAGER;
            const isProjectOwner = project.ownerId === auth.user.id;
            const callerProjectMember = project.projectMembers[0];
            const isProjectAdmin =
                callerProjectMember?.role === RoleTypes.ADMIN ||
                callerProjectMember?.role === RoleTypes.PROJECT_MANAGER;

            const canUpdate =
                isWorkspaceOwner ||
                isWorkspaceAdminOrPM ||
                isProjectOwner ||
                isProjectAdmin;

            if (!canUpdate) {
                throw new Error(
                    "You are not authorized to update member roles in this project"
                );
            }

            if (project.ownerId === userId) {
                throw new Error("Project owner role cannot be updated");
            }

            const targetProjectMember = await tx.projectMember.findUnique({
                where: {
                    userId_projectId: {
                        userId,
                        projectId,
                    },
                },
            });

            if (!targetProjectMember) {
                throw new Error("Member not found in this project");
            }

            await tx.projectMember.update({
                where: {
                    userId_projectId: {
                        userId,
                        projectId,
                    },
                },
                data: {
                    role: role as RoleTypes,
                },
            });
        });

        return { success: true, userId, projectId, role };
    });
