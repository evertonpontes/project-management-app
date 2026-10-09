"use client";

import {
    RiMoreFill,
    RiFileCopyLine,
    RiUserLine,
    RiShieldUserLine,
    RiUserUnfollowLine,
    RiCheckLine,
    RiLoaderLine,
} from "@remixicon/react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { ProjectMemberItem, PROJECT_ROLE_OPTIONS } from "../types";
import { useUpdateProjectMember, useDeleteProjectMember } from "../hooks";
import { RoleTypes } from "@/generated/prisma/enums";

export interface ProjectMemberActionsProps {
    member: ProjectMemberItem;
    onRoleChange?: (member: ProjectMemberItem, newRole: string) => void;
    onRemoveMember?: (member: ProjectMemberItem) => void;
    isCurrentUser?: boolean;
}

export function ProjectMemberActions({
    member,
    onRoleChange,
    onRemoveMember,
    isCurrentUser = false,
}: ProjectMemberActionsProps) {
    const handleCopyEmail = async () => {
        if (!member.user?.email) return;
        try {
            await navigator.clipboard.writeText(member.user.email);
            toast.success("Member email copied to clipboard!");
        } catch {
            toast.error("Failed to copy email.");
        }
    };

    const handleCopyUserId = async () => {
        if (!member.userId) return;
        try {
            await navigator.clipboard.writeText(member.userId);
            toast.success("User ID copied to clipboard!");
        } catch {
            toast.error("Failed to copy user ID.");
        }
    };

    const initialRole =
        member.role === RoleTypes.ADMIN || member.role === RoleTypes.VIEWER
            ? (member.role as "ADMIN" | "VIEWER")
            : "MEMBER";

    const { action: updateRoleAction } = useUpdateProjectMember({
        userId: member.userId,
        projectId: member.projectId,
        role: initialRole,
    });

    const { action: deleteMemberAction } = useDeleteProjectMember({
        userId: member.userId,
        projectId: member.projectId,
    });

    const [ConfirmDialog, confirmRemove] = useConfirm(
        "Remove member from project?",
        `Are you sure you want to remove ${member.user?.name || member.user?.email || "this member"} from this project? They will lose access to all tasks and boards within this project.`,
        "destructive"
    );

    const handleUpdateRole = async (newRole: RoleTypes) => {
        if (
            newRole === member.role ||
            updateRoleAction.isPending ||
            deleteMemberAction.isPending
        ) {
            return;
        }

        const result = await updateRoleAction.executeAsync({
            userId: member.userId,
            projectId: member.projectId,
            role: newRole as "ADMIN" | "MEMBER" | "VIEWER",
        });

        if (!result?.serverError && !result?.validationErrors) {
            onRoleChange?.(member, newRole);
        }
    };

    const handleRemoveMember = async () => {
        if (deleteMemberAction.isPending || updateRoleAction.isPending) return;

        const ok = await confirmRemove();
        if (!ok) return;

        const result = await deleteMemberAction.executeAsync({
            userId: member.userId,
            projectId: member.projectId,
        });

        if (!result?.serverError && !result?.validationErrors) {
            onRemoveMember?.(member);
        }
    };

    return (
        <>
            <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label={`Open menu for ${member.user?.name || member.user?.email || "member"}`}
                        >
                            <RiMoreFill className="size-4" />
                        </Button>
                    }
                />
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Member actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={handleCopyEmail}
                            className="cursor-pointer"
                        >
                            <RiFileCopyLine className="size-4" />
                            <span>Copy email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleCopyUserId}
                            className="cursor-pointer"
                        >
                            <RiUserLine className="size-4" />
                            <span>Copy user ID</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    {!isCurrentUser && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger
                                        disabled={
                                            updateRoleAction.isPending ||
                                            deleteMemberAction.isPending
                                        }
                                        className="cursor-pointer"
                                    >
                                        {updateRoleAction.isPending ? (
                                            <RiLoaderLine className="size-4 animate-spin text-muted-foreground" />
                                        ) : (
                                            <RiShieldUserLine className="size-4" />
                                        )}
                                        <span>
                                            {updateRoleAction.isPending
                                                ? "Updating role..."
                                                : "Change role"}
                                        </span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-44">
                                        {PROJECT_ROLE_OPTIONS.map((option) => {
                                            const isCurrentRole =
                                                member.role?.toUpperCase() ===
                                                option.value;
                                            return (
                                                <DropdownMenuItem
                                                    key={option.value}
                                                    onClick={() =>
                                                        handleUpdateRole(
                                                            option.value
                                                        )
                                                    }
                                                    disabled={
                                                        isCurrentRole ||
                                                        updateRoleAction.isPending ||
                                                        deleteMemberAction.isPending
                                                    }
                                                    className="cursor-pointer flex items-center justify-between"
                                                >
                                                    <span>{option.label}</span>
                                                    {isCurrentRole && (
                                                        <RiCheckLine className="size-4 text-primary" />
                                                    )}
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                        </>
                    )}

                    {!isCurrentUser && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={handleRemoveMember}
                                    disabled={
                                        deleteMemberAction.isPending ||
                                        updateRoleAction.isPending
                                    }
                                    className="focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer"
                                >
                                    {deleteMemberAction.isPending ? (
                                        <RiLoaderLine className="size-4 animate-spin" />
                                    ) : (
                                        <RiUserUnfollowLine className="size-4" />
                                    )}
                                    <span>
                                        {deleteMemberAction.isPending
                                            ? "Removing member..."
                                            : "Remove member"}
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
