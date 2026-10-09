"use server";

import { authClient } from "@/lib/safe-action";
import { createProjectMember } from "../types";
import { RoleTypes } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const createProjectMemberAction = authClient
    .inputSchema(createProjectMember)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { userEmail, projectId, role } = parsedInput;

        const newMember = await prisma.$transaction(async (tx) => {
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

            const canInvite =
                isWorkspaceOwner ||
                isWorkspaceAdminOrPM ||
                isProjectOwner ||
                isProjectAdmin;

            if (!canInvite) {
                throw new Error(
                    "You are not authorized to invite members to this project"
                );
            }

            const targetUser = await tx.user.findUnique({
                where: { email: userEmail },
            });

            if (!targetUser) {
                throw new Error("User not found with this email");
            }

            const existingProjectMember = await tx.projectMember.findUnique({
                where: {
                    userId_projectId: {
                        userId: targetUser.id,
                        projectId,
                    },
                },
            });

            if (existingProjectMember) {
                throw new Error("User is already a member of this project");
            }

            // Ensure target user is also a member of the workspace
            const targetWorkspaceMember = await tx.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: targetUser.id,
                        workspaceId: project.workspaceId,
                    },
                },
            });

            if (!targetWorkspaceMember) {
                await tx.workspaceMember.create({
                    data: {
                        userId: targetUser.id,
                        workspaceId: project.workspaceId,
                        role: RoleTypes.MEMBER,
                    },
                });
            }

            const createdMember = await tx.projectMember.create({
                data: {
                    userId: targetUser.id,
                    projectId,
                    role: role as RoleTypes,
                },
                include: {
                    user: true,
                },
            });

            return createdMember;
        });

        return newMember;
    });
