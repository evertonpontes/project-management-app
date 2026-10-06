"use server"

import { authClient } from "@/lib/safe-action"
import { deleteWorkspace } from "../types"
import prisma from "@/lib/prisma"

export const deleteWorkspaceAction = authClient
    .inputSchema(deleteWorkspace)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { id } = parsedInput

        await prisma.$transaction(async (tx) => {
            const workspaceMember = await tx.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: auth.user.id,
                        workspaceId: id
                    }
                },
                include: {
                    workspace: true
                }
            })

            if (!workspaceMember) {
                throw new Error("You are not a member of this workspace")
            }

            if (workspaceMember.workspace.ownerId !== auth.user.id) {
                throw new Error("You are not authorized to delete this workspace")
            }

            await tx.workspace.delete({
                where: {
                    id
                }
            })
        })
    })