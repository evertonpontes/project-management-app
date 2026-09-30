import z from "zod";

export const createWorkspace = z.object({
    name: z.string().min(3, "Workspace name must be at least 3 characters long.").max(255, "Workspace name must not exceed 255 characters."),
    description: z.string().max(1000, "Workspace description must not exceed 1000 characters.").optional(),
    avatarUrl: z.string().optional(),
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspace>

export type PaginationInput = {
    page?: number;
    rowSize?: number;
}