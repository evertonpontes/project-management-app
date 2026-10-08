import { RoleTypes } from "@/generated/prisma/enums";
import z from "zod";

export const createWorkspaceMember = z.object({
    userEmail: z.email("Invalid email address").min(1, "Email is required"),
    workspaceId: z
        .uuid("Invalid workspace ID")
        .min(1, "Workspace ID is required"),
    role: z.enum(RoleTypes),
});

export const updateWorkspaceMember = z.object({
    userId: z.string().min(1, "User ID is required"),
    workspaceId: z
        .uuid("Invalid workspace ID")
        .min(1, "Workspace ID is required"),
    role: z.enum(RoleTypes),
});

export type CreateWorkspaceMemberInput = z.infer<typeof createWorkspaceMember>;
export type UpdateWorkspaceMemberInput = z.infer<typeof updateWorkspaceMember>;

export type WorkspaceMemberUser = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    createdAt?: Date | string;
};

export type WorkspaceMemberItem = {
    id: string;
    userId: string;
    workspaceId: string;
    role:
        | RoleTypes
        | "ADMIN"
        | "MEMBER"
        | "PROJECT_MANAGER"
        | "VIEWER"
        | string;
    createdAt: Date | string;
    updatedAt?: Date | string;
    user: WorkspaceMemberUser;
};
