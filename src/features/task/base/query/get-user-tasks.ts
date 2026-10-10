"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TaskStatus } from "@/generated/prisma/enums";
import type {
    GetTasksResponse,
    TaskFilters,
    TaskItem,
    TaskPaginationInput,
} from "../types";

export async function getUserTasks(
    filters: TaskFilters = {},
    pagination: TaskPaginationInput = {}
): Promise<GetTasksResponse> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const { status, type, priority, search } = filters;
    const page = pagination.page && pagination.page > 0 ? pagination.page : 1;
    const rowSize = pagination.rowSize && pagination.rowSize > 0 ? pagination.rowSize : 50;
    const skip = (page - 1) * rowSize;

    const whereClause: Record<string, unknown> = {
        OR: [
            { assignedToId: session.user.id },
            { createdById: session.user.id },
        ],
    };

    if (status && status !== "ALL") {
        whereClause.status = status;
    }

    if (type && type !== "ALL") {
        whereClause.type = type;
    }

    if (priority && priority !== "ALL") {
        whereClause.priority = priority;
    }

    if (search && search.trim().length > 0) {
        whereClause.AND = [
            {
                OR: [
                    {
                        title: {
                            contains: search.trim(),
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: search.trim(),
                            mode: "insensitive",
                        },
                    },
                ],
            },
        ];
    }

    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where: whereClause,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                        workspaceId: true,
                        ownerId: true,
                        workspace: {
                            select: {
                                id: true,
                                ownerId: true,
                            },
                        },
                    },
                },
                subTasks: {
                    orderBy: {
                        order: "asc",
                    },
                },
            },
            skip,
            take: rowSize,
            orderBy: [
                { dueDate: "asc" },
                { createdAt: "desc" },
            ],
        }),
        prisma.task.count({
            where: whereClause,
        }),
    ]);

    const mappedTasks: TaskItem[] = tasks.map((task) => {
        let progress = 0;
        if (task.subTasks && task.subTasks.length > 0) {
            const completed = task.subTasks.filter((st) => st.isCompleted).length;
            progress = Math.round((completed / task.subTasks.length) * 100);
        } else if (task.status === TaskStatus.DONE) {
            progress = 100;
        }

        return {
            ...task,
            progress,
        };
    });

    const totalPages = Math.ceil(total / rowSize) || 1;

    return {
        tasks: mappedTasks,
        pagination: {
            page,
            rowSize,
            total,
            totalPages,
        },
    };
}
