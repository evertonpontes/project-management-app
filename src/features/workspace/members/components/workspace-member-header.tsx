"use client";

import { RiUserAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";

export interface WorkspaceMemberHeaderProps {
    title?: string;
    description?: string;
    onInviteMember?: () => void;
    isInviteDisabled?: boolean;
    className?: string;
}

export function WorkspaceMemberHeader({
    title = "Workspace Members",
    description = "Manage workspace members, assign roles, and invite collaborators to your workspace.",
    onInviteMember,
    isInviteDisabled = false,
    className = "",
}: WorkspaceMemberHeaderProps) {
    return (
        <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {title}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            <Button
                type="button"
                onClick={onInviteMember}
                disabled={isInviteDisabled}
                className="w-full sm:w-auto"
            >
                <RiUserAddLine className="size-4" data-icon="inline-start" />
                <span>Invite member</span>
            </Button>
        </div>
    );
}
