import { TaskPriority, TaskStatus, TaskTypes } from "@/generated/prisma/enums";
import z from "zod";

export const TASK_STATUS_OPTIONS = [
    { label: "Backlog", value: TaskStatus.TODO, color: "bg-slate-400" },
    { label: "In Progress", value: TaskStatus.IN_PROGRESS, color: "bg-amber-500" },
    { label: "In Review", value: TaskStatus.IN_REVIEW, color: "bg-blue-500" },
    { label: "Done", value: TaskStatus.DONE, color: "bg-emerald-500" },
] as const;

export const TASK_PRIORITY_OPTIONS = [
    { label: "Low", value: TaskPriority.LOW, color: "bg-blue-500" },
    { label: "Medium", value: TaskPriority.MEDIUM, color: "bg-amber-500" },
    { label: "High", value: TaskPriority.HIGH, color: "bg-rose-500" },
    { label: "Critical", value: TaskPriority.CRITICAL, color: "bg-purple-600" },
] as const;

export const TASK_TYPE_OPTIONS = [
    { label: "Task", value: TaskTypes.TASK },
    { label: "Bug", value: TaskTypes.BUG },
    { label: "Feature", value: TaskTypes.FEATURE },
    { label: "Story", value: TaskTypes.STORY },
    { label: "Epic", value: TaskTypes.EPIC },
] as const;

export const createTask = z.object({
    projectId: z
        .string()
        .uuid("Invalid project ID")
        .min(1, "Project is required"),
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().optional().nullable(),
    type: z
        .enum([
            TaskTypes.TASK,
            TaskTypes.BUG,
            TaskTypes.FEATURE,
            TaskTypes.STORY,
            TaskTypes.EPIC,
        ] as const)
        .default(TaskTypes.TASK),
    status: z
        .enum([
            TaskStatus.TODO,
            TaskStatus.IN_PROGRESS,
            TaskStatus.IN_REVIEW,
            TaskStatus.DONE,
        ] as const)
        .default(TaskStatus.TODO),
    priority: z
        .enum([
            TaskPriority.LOW,
            TaskPriority.MEDIUM,
            TaskPriority.HIGH,
            TaskPriority.CRITICAL,
        ] as const)
        .default(TaskPriority.MEDIUM),
    startDate: z.coerce.date().optional().nullable(),
    dueDate: z.coerce.date().optional().nullable(),
    assignedToId: z.string().optional().nullable(),
});

export type CreateTaskInput = z.infer<typeof createTask>;

export interface TaskFilters {
    status?: TaskStatus | "ALL";
    type?: TaskTypes | "ALL";
    priority?: TaskPriority | "ALL";
    search?: string;
}

export interface TaskPaginationInput {
    page?: number;
    rowSize?: number;
}

export type TaskUser = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
};

export type SubtaskItem = {
    id: string;
    title: string;
    isCompleted: boolean;
    order: number;
    taskId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};

export type TaskItem = {
    id: string;
    projectId: string;
    createdById?: string | null;
    assignedToId?: string | null;
    title: string;
    description?: string | null;
    type: TaskTypes;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt: Date | string;
    updatedAt: Date | string;
    completedAt?: Date | string | null;
    startDate?: Date | string | null;
    dueDate?: Date | string | null;
    createdBy?: TaskUser | null;
    assignedTo?: TaskUser | null;
    project?: {
        id: string;
        name: string;
        workspaceId: string;
    };
    subTasks?: SubtaskItem[];
    progress?: number;
};

export type GetTasksResponse = {
    tasks: TaskItem[];
    pagination: {
        page: number;
        rowSize: number;
        total: number;
        totalPages: number;
    };
};
