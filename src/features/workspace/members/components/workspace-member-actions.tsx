"use client";

import {
    RiMoreFill,
    RiFileCopyLine,
    RiUserLine,
    RiShieldUserLine,
    RiUserUnfollowLine,
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceMemberItem } from "../types";

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

                {onRoleChange && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => onRoleChange(member, "ADMIN")}
                                disabled={member.role === "ADMIN"}
                                className="cursor-pointer"
                            >
                                <RiShieldUserLine className="size-4" />
                                <span>Change role</span>
                            </DropdownMenuItem>
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
