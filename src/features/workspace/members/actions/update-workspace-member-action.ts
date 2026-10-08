"use server";

import { authClient } from "@/lib/safe-action";
import { updateWorkspaceMember } from "../types";
import prisma from "@/lib/prisma";

export const updateWorkspaceMemberAction = authClient
    .inputSchema(updateWorkspaceMember)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { userId, workspaceId, role } = parsedInput;

        await prisma.$transaction(async (tx) => {
            const workspaceMember = await tx.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: auth.user.id,
                        workspaceId,
                    },
                },
                include: {
                    workspace: true,
                },
            });

            if (userId === auth.user.id) {
                throw new Error("You cannot update your own role");
            }

            if (!workspaceMember) {
                throw new Error("You are not a member of this workspace");
            }

            if (
                workspaceMember.role !== "ADMIN" &&
                workspaceMember.workspace.ownerId !== auth.user.id
            ) {
                throw new Error(
                    "You are not authorized to invite member to this workspace"
                );
            }

            const workspaceMemberToUpdate = await tx.workspaceMember.findUnique(
                {
                    where: {
                        userId_workspaceId: {
                            userId,
                            workspaceId,
                        },
                    },
                }
            );

            if (!workspaceMemberToUpdate) {
                throw new Error("Member not found in workspace");
            }

            if (workspaceMemberToUpdate.role === "ADMIN") {
                throw new Error("Admin cannot be updated");
            }

            if (workspaceMemberToUpdate.userId === auth.user.id) {
                throw new Error("You cannot update your own role");
            }

            await tx.workspaceMember.update({
                where: {
                    userId_workspaceId: {
                        userId,
                        workspaceId,
                    },
                },
                data: {
                    role,
                },
            });
        });
    });
