"use client";

import { useEffect } from "react";
import { RiLoaderLine, RiUserAddLine } from "@remixicon/react";
import { RoleTypes } from "@/generated/prisma/enums";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateWorkspaceMember } from "../hooks";

export interface WorkspaceMemberInviteDialogProps {
    workspaceId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WorkspaceMemberInviteDialog({
    workspaceId,
    open,
    onOpenChange,
}: WorkspaceMemberInviteDialogProps) {
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
    } = useCreateWorkspaceMember(workspaceId, () => {
        onOpenChange(false);
    });

    const isPending = action.isPending;
    const selectedRole = watch("role") || RoleTypes.MEMBER;

    useEffect(() => {
        if (open) {
            reset({
                userEmail: "",
                workspaceId,
                role: RoleTypes.MEMBER,
            });
        }
    }, [open, reset, workspaceId]);

    const handleRoleChange = (value: unknown) => {
        if (typeof value === "string") {
            setValue("role", value as typeof RoleTypes[keyof typeof RoleTypes], {
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
                    <span>Invite member</span>
                </span>
            }
            description="Invite a new collaborator to this workspace. They will receive access based on their assigned role."
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
                    <FieldLabel htmlFor="role">Role</FieldLabel>
                    <Select
                        value={selectedRole}
                        onValueChange={handleRoleChange}
                        disabled={isPending}
                    >
                        <SelectTrigger id="role" className="w-full">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={RoleTypes.MEMBER}>
                                Member (Standard workspace access)
                            </SelectItem>
                            <SelectItem value={RoleTypes.PROJECT_MANAGER}>
                                Project Manager (Manage projects & tasks)
                            </SelectItem>
                            <SelectItem value={RoleTypes.ADMIN}>
                                Admin (Full administrative control)
                            </SelectItem>
                            <SelectItem value={RoleTypes.VIEWER}>
                                Viewer (Read-only access)
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
                        <span>{isPending ? "Inviting..." : "Send invite"}</span>
                    </Button>
                </div>
            </form>
        </ResponsiveModal>
    );
}

export { WorkspaceMemberInviteDialog as WorkspaceMemberInviteModal };
export default WorkspaceMemberInviteDialog;
