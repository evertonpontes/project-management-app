import z from "zod";

export const MAX_WORKSPACE_DESCRIPTION_LENGTH = 1000;

export const createWorkspace = z.object({
    name: z.string().min(3, "Workspace name must be at least 3 characters long.").max(255, "Workspace name must not exceed 255 characters."),
    description: z.string().max(MAX_WORKSPACE_DESCRIPTION_LENGTH, `Workspace description must not exceed ${MAX_WORKSPACE_DESCRIPTION_LENGTH} characters.`).optional(),
    avatarUrl: z.string().optional(),
})

export const updateWorkspace = z.object({
    id: z.uuid().min(1, "Workspace ID is required."),
    name: z.string().min(3, "Workspace name must be at least 3 characters long.").max(255, "Workspace name must not exceed 255 characters.").optional(),
    key: z.string().max(10, "Workspace key must not exceed 10 characters.").optional(),
    description: z.string().max(MAX_WORKSPACE_DESCRIPTION_LENGTH, `Workspace description must not exceed ${MAX_WORKSPACE_DESCRIPTION_LENGTH} characters.`).optional(),
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