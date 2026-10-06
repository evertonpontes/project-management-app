"use server"

import { authClient } from "@/lib/safe-action";
import { createWorkspace } from "../types";
import { generateKey } from "@/lib/utils";
import prisma from "@/lib/prisma";

export const createWorkspaceAction = authClient
    .inputSchema(createWorkspace)
    .action(async ({ parsedInput, ctx: { auth } }) => {

        const { name, description, avatarUrl } = parsedInput;

        const key = generateKey(10);

        const workspace = await prisma.workspace.create({
            data: {
                name,
                description,
                key,
                avatarUrl,
                ownerId: auth.user.id,
                workspaceMembers: {
                    create: {
                        userId: auth.user.id,
                        role: "ADMIN"
                    }
                }
            },
        })

        return {
            workspace
        }

    })