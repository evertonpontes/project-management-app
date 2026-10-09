"use server";

import { authClient } from "@/lib/safe-action";
import { deleteProjectMember } from "../types";
import { RoleTypes } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const deleteProjectMemberAction = authClient
    .inputSchema(deleteProjectMember)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { userId, projectId } = parsedInput;

        await prisma.$transaction(async (tx) => {
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

            if (project.ownerId === userId) {
                throw new Error("Project owner cannot be removed from this project");
            }

            if (userId !== auth.user.id) {
                const isWorkspaceOwner = project.workspace.ownerId === auth.user.id;
                const isWorkspaceAdminOrPM =
                    callerWorkspaceMember.role === RoleTypes.ADMIN ||
                    callerWorkspaceMember.role === RoleTypes.PROJECT_MANAGER;
                const isProjectOwner = project.ownerId === auth.user.id;
                const callerProjectMember = project.projectMembers[0];
                const isProjectAdmin =
                    callerProjectMember?.role === RoleTypes.ADMIN ||
                    callerProjectMember?.role === RoleTypes.PROJECT_MANAGER;

                const canRemove =
                    isWorkspaceOwner ||
                    isWorkspaceAdminOrPM ||
                    isProjectOwner ||
                    isProjectAdmin;

                if (!canRemove) {
                    throw new Error(
                        "You are not authorized to remove members from this project"
                    );
                }
            }

            const targetMember = await tx.projectMember.findUnique({
                where: {
                    userId_projectId: {
                        userId,
                        projectId,
                    },
                },
            });

            if (!targetMember) {
                throw new Error("Member not found in this project");
            }

            await tx.projectMember.delete({
                where: {
                    userId_projectId: {
                        userId,
                        projectId,
                    },
                },
            });
        });

        return { success: true, userId, projectId };
    });
