"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { WorkspaceMemberItem } from "../types";
import { WorkspaceMemberActions } from "./workspace-member-actions";

function getInitials(name?: string, email?: string): string {
    if (name && name.trim().length > 0) {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }
    if (email && email.trim().length > 0) {
        return email.slice(0, 2).toUpperCase();
    }
    return "MB";
}

function getRoleBadgeVariant(role: string): "default" | "secondary" | "outline" | "ghost" {
    switch (role?.toUpperCase()) {
        case "ADMIN":
            return "default";
        case "PROJECT_MANAGER":
            return "secondary";
        case "MEMBER":
            return "outline";
        case "VIEWER":
            return "ghost";
        default:
            return "outline";
    }
}

function formatRoleLabel(role: string): string {
    switch (role?.toUpperCase()) {
        case "ADMIN":
            return "Admin";
        case "PROJECT_MANAGER":
            return "Project Manager";
        case "MEMBER":
            return "Member";
        case "VIEWER":
            return "Viewer";
        default:
            return role || "Member";
    }
}

export interface WorkspaceMemberColumnsOptions {
    onRoleChange?: (member: WorkspaceMemberItem, newRole: string) => void;
    onRemoveMember?: (member: WorkspaceMemberItem) => void;
    currentUserId?: string;
}

export function createWorkspaceMemberColumns({
    onRoleChange,
    onRemoveMember,
    currentUserId,
}: WorkspaceMemberColumnsOptions = {}): ColumnDef<WorkspaceMemberItem>[] {
    return [
        {
            id: "member",
            header: "Member",
            accessorFn: (row) => `${row.user?.name || ""} ${row.user?.email || ""}`,
            cell: ({ row }) => {
                const member = row.original;
                const user = member.user;
                const initials = getInitials(user?.name, user?.email);

                return (
                    <div className="flex items-center gap-3">
                        <Avatar size="default" className="size-8">
                            {user?.image && <AvatarImage src={user.image} alt={user?.name || "Avatar"} />}
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <span className="truncate text-sm font-medium text-foreground">
                                {user?.name || "Unnamed User"}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.original.role;
                return (
                    <Badge variant={getRoleBadgeVariant(role)}>
                        {formatRoleLabel(role)}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Joined",
            cell: ({ row }) => {
                const createdAt = row.original.createdAt;
                if (!createdAt) return <span className="text-muted-foreground text-xs">—</span>;

                try {
                    const date = new Date(createdAt);
                    const formatted = new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    }).format(date);
                    return <span className="text-xs text-muted-foreground">{formatted}</span>;
                } catch {
                    return <span className="text-xs text-muted-foreground">—</span>;
                }
            },
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => {
                const member = row.original;
                const isCurrentUser = Boolean(currentUserId && member.userId === currentUserId);

                return (
                    <div className="text-right">
                        <WorkspaceMemberActions
                            member={member}
                            onRoleChange={onRoleChange}
                            onRemoveMember={onRemoveMember}
                            isCurrentUser={isCurrentUser}
                        />
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];
}
