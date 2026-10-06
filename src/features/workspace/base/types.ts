import z from "zod";

export const createWorkspace = z.object({
    name: z.string().min(3, "Workspace name must be at least 3 characters long.").max(255, "Workspace name must not exceed 255 characters."),
    description: z.string().max(1000, "Workspace description must not exceed 1000 characters.").optional(),
    avatarUrl: z.string().optional(),
})

export const updateWorkspace = z.object({
    id: z.uuid().min(1, "Workspace ID is required."),
    name: z.string().min(3, "Workspace name must be at least 3 characters long.").max(255, "Workspace name must not exceed 255 characters.").optional(),
    description: z.string().max(1000, "Workspace description must not exceed 1000 characters.").optional(),
    avatarUrl: z.string().optional(),
})

export const deleteWorkspace = z.object({
    id: z.uuid().min(1, "Workspace ID is required."),
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspace>
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspace>
export type DeleteWorkspaceInput = z.infer<typeof deleteWorkspace>
export type PaginationInput = {
    page?: number;
    rowSize?: number;
}