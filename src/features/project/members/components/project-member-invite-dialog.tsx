"use client";

import { useEffect } from "react";
import { RiLoaderLine, RiUserAddLine } from "@remixicon/react";
import { RoleTypes } from "@/generated/prisma/enums";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateProjectMember } from "../hooks";

export interface ProjectMemberInviteDialogProps {
    projectId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProjectMemberInviteDialog({
    projectId,
    open,
    onOpenChange,
}: ProjectMemberInviteDialogProps) {
    const {
        form: {
            register,
            setValue,
            watch,
            reset,
            formState: { errors },
        },
        handleSubmitWithAction,
        action,
    } = useCreateProjectMember(projectId, () => {
        onOpenChange(false);
    });

    const isPending = action.isPending;
    const selectedRole = watch("role") || RoleTypes.MEMBER;

    useEffect(() => {
        if (open) {
            reset({
                userEmail: "",
                projectId,
                role: RoleTypes.MEMBER,
            });
        }
    }, [open, reset, projectId]);

    const handleRoleChange = (value: unknown) => {
        if (typeof value === "string") {
            setValue("role", value as "ADMIN" | "MEMBER" | "VIEWER", {
                shouldValidate: true,
            });
        }
    };

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title={
                <span className="flex items-center gap-2">
                    <RiUserAddLine className="size-5 text-primary" />
                    <span>Add Project Member</span>
                </span>
            }
            description="Add a team member to this project by email. They will receive access based on their assigned role."
            dialogClassName="sm:max-w-md"
        >
            <form
                onSubmit={handleSubmitWithAction}
                className="space-y-4 py-2"
            >
                <Field>
                    <FieldLabel htmlFor="userEmail">Email address</FieldLabel>
                    <Input
                        id="userEmail"
                        type="email"
                        placeholder="colleague@example.com"
                        disabled={isPending}
                        {...register("userEmail")}
                    />
                    {errors.userEmail?.message && (
                        <FieldError>{errors.userEmail.message}</FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="role">Project Role</FieldLabel>
                    <Select
                        value={selectedRole}
                        onValueChange={handleRoleChange}
                        disabled={isPending}
                    >
                        <SelectTrigger id="role" className="w-full">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={RoleTypes.ADMIN}>
                                Admin (Manage project, tasks & members)
                            </SelectItem>
                            <SelectItem value={RoleTypes.MEMBER}>
                                Member (Create and update tasks)
                            </SelectItem>
                            <SelectItem value={RoleTypes.VIEWER}>
                                Viewer (View-only project access)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.role?.message && (
                        <FieldError>{errors.role.message}</FieldError>
                    )}
                </Field>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <RiLoaderLine className="size-4 animate-spin" />}
                        <span>{isPending ? "Adding..." : "Add to Project"}</span>
                    </Button>
                </div>
            </form>
        </ResponsiveModal>
    );
}

export { ProjectMemberInviteDialog as ProjectMemberInviteModal };
export default ProjectMemberInviteDialog;
