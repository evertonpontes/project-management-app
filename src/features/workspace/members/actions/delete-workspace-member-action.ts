"use server";

import { authClient } from "@/lib/safe-action";
import { deleteWorkspaceMember } from "../types";
import prisma from "@/lib/prisma";

export const deleteWorkspaceMemberAction = authClient
    .inputSchema(deleteWorkspaceMember)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { userId, workspaceId } = parsedInput;

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

            if (!workspaceMember) {
                throw new Error("You are not a member of this workspace");
            }

            if (userId !== auth.user.id) {
                if (
                    workspaceMember.role !== "ADMIN" &&
                    workspaceMember.workspace.ownerId !== auth.user.id
                ) {
                    throw new Error(
                        "You are not authorized to remove member from this workspace"
                    );
                }
            } else {
                if (workspaceMember.workspace.ownerId === auth.user.id) {
                    throw new Error("Owner cannot be removed");
                }
            }

            await tx.workspaceMember.delete({
                where: {
                    userId_workspaceId: {
                        userId,
                        workspaceId,
                    },
                },
            });
        });
    });
