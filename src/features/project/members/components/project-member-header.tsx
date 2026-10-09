"use client";

import { RiUserAddLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";

export interface ProjectMemberHeaderProps {
    title?: string;
    description?: string;
    onInviteMember?: () => void;
    isInviteDisabled?: boolean;
    className?: string;
}

export function ProjectMemberHeader({
    title = "Project Members",
    description = "Manage project members, assign roles, and collaborate on this project.",
    onInviteMember,
    isInviteDisabled = false,
    className = "",
}: ProjectMemberHeaderProps) {
    return (
        <div
            className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
            data-slot="project-member-header"
        >
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {title}
                </h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button
                type="button"
                onClick={onInviteMember}
                disabled={isInviteDisabled}
                className="w-full sm:w-auto cursor-pointer"
            >
                <RiUserAddLine className="size-4" data-icon="inline-start" />
                <span>Add member</span>
            </Button>
        </div>
    );
}
