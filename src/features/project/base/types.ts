import z from "zod";

export const createProject = z.object({
    name: z
        .string()
        .min(3, "Project name must be at least 3 characters long.")
        .max(255, "Project name must not exceed 255 characters."),
    workspaceId: z
        .uuid("Invalid workspace ID")
        .min(1, "Workspace ID is required."),
    startDate: z.coerce.date({ message: "Start date is required." }),
    dueDate: z.coerce.date({ message: "Due date is required." }),
});

export const updateProject = z.object({
    id: z
        .uuid("Invalid project ID")
        .min(1, "Project ID is required."),
    workspaceId: z
        .uuid("Invalid workspace ID")
        .min(1, "Workspace ID is required.")
        .optional(),
    name: z
        .string()
        .min(3, "Project name must be at least 3 characters long.")
        .max(255, "Project name must not exceed 255 characters.")
        .optional(),
    startDate: z.coerce.date({ message: "Start date is required." }).optional(),
    dueDate: z.coerce.date({ message: "Due date is required." }).optional(),
});

export const deleteProject = z.object({
    id: z
        .uuid("Invalid project ID")
        .min(1, "Project ID is required."),
});

export type CreateProjectInput = z.infer<typeof createProject>;
export type UpdateProjectInput = z.infer<typeof updateProject>;
export type DeleteProjectInput = z.infer<typeof deleteProject>;

export type PaginationInput = {
    page?: number;
    rowSize?: number;
};

export type ProjectOwner = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
};

export type ProjectMemberItem = {
    id: string;
    userId: string;
    projectId: string;
    role: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: ProjectOwner;
};

export type ProjectItem = {
    id: string;
    name: string;
    ownerId: string;
    workspaceId: string;
    startDate: Date | string;
    dueDate: Date | string;
    createdAt: Date | string;
    updatedAt?: Date | string;
    isDone?: boolean;
    status?: string;
    tasks?: { status: string }[];
    owner?: ProjectOwner;
    projectMembers?: ProjectMemberItem[];
    _count?: {
        tasks: number;
        projectMembers: number;
    };
};

export type GetProjectsResponse = {
    projects: ProjectItem[];
    pagination: {
        page: number;
        rowSize: number;
        total: number;
        totalPages: number;
    };
};
