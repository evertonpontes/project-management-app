"use server"

import prisma from "@/lib/prisma"
import { authClient } from "@/lib/safe-action"
import { updateWorkspace } from "../types"

export const updateWorkspaceAction = authClient
    .inputSchema(updateWorkspace)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { id, name, key, description, avatarUrl } = parsedInput

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

            if (workspaceMember.role !== "ADMIN" && workspaceMember.workspace.ownerId !== auth.user.id) {
                throw new Error("You are not authorized to update this workspace")
            }

            const updatedWorkspace = await tx.workspace.update({
                where: {
                    id
                },
                data: {
                    name,
                    description,
                    key,
                    avatarUrl
                }
            })

            return updatedWorkspace
        })
    })