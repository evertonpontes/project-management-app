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
import { WorkspaceMemberItem } from "../types";
import { useUpdateWorkspaceMember } from "../hooks";
import { RoleTypes } from "@/generated/prisma/enums";

const ROLE_OPTIONS = [
    { label: "Admin", value: RoleTypes.ADMIN },
    { label: "Project Manager", value: RoleTypes.PROJECT_MANAGER },
    { label: "Member", value: RoleTypes.MEMBER },
    { label: "Viewer", value: RoleTypes.VIEWER },
] as const;

export interface WorkspaceMemberActionsProps {
    member: WorkspaceMemberItem;
    onRoleChange?: (member: WorkspaceMemberItem, newRole: string) => void;
    onRemoveMember?: (member: WorkspaceMemberItem) => void;
    isCurrentUser?: boolean;
}

export function WorkspaceMemberActions({
    member,
    onRoleChange,
    onRemoveMember,
    isCurrentUser = false,
}: WorkspaceMemberActionsProps) {
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

    const { action } = useUpdateWorkspaceMember({
        userId: member.userId,
        workspaceId: member.workspaceId,
        role: member.role as RoleTypes,
    });

    const handleUpdateRole = async (newRole: RoleTypes) => {
        if (newRole === member.role || action.isPending) return;

        const result = await action.executeAsync({
            userId: member.userId,
            workspaceId: member.workspaceId,
            role: newRole,
        });

        if (!result?.serverError && !result?.validationErrors) {
            onRoleChange?.(member, newRole);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-foreground"
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
                                        member.role?.toUpperCase() ===
                                            RoleTypes.ADMIN || action.isPending
                                    }
                                    className="cursor-pointer"
                                >
                                    {action.isPending ? (
                                        <RiLoaderLine className="size-4 animate-spin text-muted-foreground" />
                                    ) : (
                                        <RiShieldUserLine className="size-4" />
                                    )}
                                    <span>
                                        {action.isPending
                                            ? "Updating role..."
                                            : "Change role"}
                                    </span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-44">
                                    {ROLE_OPTIONS.map((option) => {
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
                                                    action.isPending
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

                {!isCurrentUser && onRemoveMember && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onRemoveMember(member)}
                                className="focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer"
                            >
                                <RiUserUnfollowLine className="size-4" />
                                <span>Remove member</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
