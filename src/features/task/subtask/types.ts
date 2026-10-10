import z from "zod";

export const createSubtask = z.object({
    taskId: z.uuid("Invalid task ID").min(1, "Task ID is required"),
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    isCompleted: z.boolean().default(false),
    order: z.number().int().optional(),
    startDate: z.coerce.date().optional().nullable(),
    dueDate: z.coerce.date().optional().nullable(),
});

export type CreateSubtaskInput = z.infer<typeof createSubtask>;

export const updateSubtask = z.object({
    id: z.uuid("Invalid subtask ID").min(1, "Subtask ID is required"),
    taskId: z.uuid("Invalid task ID").optional(),
    title: z
        .string()
        .min(1, "Title is required")
        .max(255, "Title is too long")
        .optional(),
    isCompleted: z.boolean().optional(),
    order: z.number().int().optional(),
    startDate: z.coerce.date().optional().nullable(),
    dueDate: z.coerce.date().optional().nullable(),
});

export type UpdateSubtaskInput = z.infer<typeof updateSubtask>;

export const deleteSubtask = z.object({
    id: z.uuid("Invalid subtask ID").min(1, "Subtask ID is required"),
    taskId: z.uuid("Invalid task ID").optional(),
});

export type DeleteSubtaskInput = z.infer<typeof deleteSubtask>;

export const getSubtasksSchema = z.object({
    taskId: z.string().uuid("Invalid task ID").min(1, "Task ID is required"),
});

export type GetSubtasksInput = z.infer<typeof getSubtasksSchema>;

export type SubtaskItem = {
    id: string;
    title: string;
    isCompleted: boolean;
    order: number;
    taskId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    completedAt?: Date | string | null;
    startDate: Date | string;
    dueDate: Date | string;
};

export type GetSubtasksResponse = {
    subtasks: SubtaskItem[];
};
