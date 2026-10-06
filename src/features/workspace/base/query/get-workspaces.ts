"use server"

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { PaginationInput } from "../types";

export async function getWorkspaces({ page = 1, rowSize = 10 }: PaginationInput = {}) {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const skip = (page - 1) * rowSize;

    const [workspaces, total] = await Promise.all([
        prisma.workspace.findMany({
            where: {
                workspaceMembers: {
                    some: {
                        userId: session.user.id,
                    }
                }
            },
            skip,
            take: rowSize,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.workspace.count({
            where: {
                workspaceMembers: {
                    some: {
                        userId: session.user.id,
                    }
                }
            },
        }),
    ]);

    const totalPages = Math.ceil(total / rowSize);

    return {
        workspaces,
        pagination: {
            page,
            rowSize,
            total,
            totalPages,
        },
    };

}
