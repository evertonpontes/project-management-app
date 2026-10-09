"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { GetProjectsResponse, PaginationInput } from "../types";

export async function getProjects(
    workspaceId: string,
    { page = 1, rowSize = 10 }: PaginationInput = {}
): Promise<GetProjectsResponse> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const workspaceMember = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId: session.user.id,
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

    const isOwnerOrAdmin =
        workspaceMember.workspace.ownerId === session.user.id ||
        workspaceMember.role === "ADMIN";

    const whereClause = isOwnerOrAdmin
        ? { workspaceId }
        : {
              workspaceId,
              OR: [
                  { ownerId: session.user.id },
                  {
                      projectMembers: {
                          some: {
                              userId: session.user.id,
                          },
                      },
                  },
              ],
          };

    const skip = (page - 1) * rowSize;

    const [projects, total] = await Promise.all([
        prisma.project.findMany({
            where: whereClause,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                projectMembers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                    },
                },
                tasks: {
                    select: {
                        status: true,
                    },
                },
                _count: {
                    select: {
                        tasks: true,
                        projectMembers: true,
                    },
                },
            },
            skip,
            take: rowSize,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.project.count({
            where: whereClause,
        }),
    ]);

    const totalPages = Math.ceil(total / rowSize);

    const mappedProjects = projects.map((p) => ({
        ...p,
        isDone:
            p.tasks.length > 0 &&
            p.tasks.every((t) => t.status === "DONE"),
    }));

    return {
        projects: mappedProjects,
        pagination: {
            page,
            rowSize,
            total,
            totalPages,
        },
    };
}
