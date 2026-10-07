"use server"

import { authClient } from "@/lib/safe-action"
import { createWorkspaceMember } from "../types"
import prisma from "@/lib/prisma"

export const createWorkspaceMemberAction = authClient
    .inputSchema(createWorkspaceMember)
    .action(async ({ parsedInput, ctx: { auth } }) => {
        const { userEmail, workspaceId, role } = parsedInput

        const workspaceMember = await prisma.$transaction(async (tx) => {
            const workspaceMember = await tx.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: auth.user.id,
                        workspaceId
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
                throw new Error("You are not authorized to invite member to this workspace")
            }

            const user = await tx.user.findUnique({
                where: {
                    email: userEmail
                }
            })

            if (!user) {
                throw new Error("User not found")
            }

            const newWorkspaceMember = await tx.workspaceMember.create({
                data: {
                    userId: user.id,
                    workspaceId,
                    role
                }
            })

            return newWorkspaceMember
        })

        return workspaceMember
    })