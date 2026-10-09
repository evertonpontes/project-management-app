import { RoleTypes } from "@/generated/prisma/enums";
import z from "zod";

export const PROJECT_ROLE_OPTIONS = [
    { label: "Admin", value: RoleTypes.ADMIN },
    { label: "Member", value: RoleTypes.MEMBER },
    { label: "Viewer", value: RoleTypes.VIEWER },
] as const;

export const createProjectMember = z.object({
    userEmail: z.string().email("Invalid email address").min(1, "Email is required"),
    projectId: z
        .string()
        .uuid("Invalid project ID")
        .min(1, "Project ID is required"),
    role: z
        .enum([RoleTypes.ADMIN, RoleTypes.MEMBER, RoleTypes.VIEWER] as const)
        .default(RoleTypes.MEMBER),
});

export const updateProjectMember = z.object({
    userId: z.string().min(1, "User ID is required"),
    projectId: z
        .string()
        .uuid("Invalid project ID")
        .min(1, "Project ID is required"),
    role: z.enum([RoleTypes.ADMIN, RoleTypes.MEMBER, RoleTypes.VIEWER] as const),
});

export const deleteProjectMember = z.object({
    userId: z.string().min(1, "User ID is required"),
    projectId: z
        .string()
        .uuid("Invalid project ID")
        .min(1, "Project ID is required"),
});

export type CreateProjectMemberInput = z.infer<typeof createProjectMember>;
export type UpdateProjectMemberInput = z.infer<typeof updateProjectMember>;
export type DeleteProjectMemberInput = z.infer<typeof deleteProjectMember>;

export type ProjectMemberUser = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    createdAt?: Date | string;
};

export type ProjectMemberItem = {
    id: string;
    userId: string;
    projectId: string;
    role: RoleTypes | "ADMIN" | "MEMBER" | "VIEWER" | string;
    createdAt: Date | string;
    updatedAt?: Date | string;
    user: ProjectMemberUser;
};

export type GetProjectMembersResponse = {
    projectMembers: ProjectMemberItem[];
    pagination: {
        page: number;
        rowSize: number;
        total: number;
        totalPages: number;
    };
};
