"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetWorkspaceMembers } from "../hooks";
import { WorkspaceMemberItem } from "../types";
import { WorkspaceMemberHeader } from "./workspace-member-header";
import { WorkspaceMemberInviteDialog } from "./workspace-member-invite-dialog";
import { WorkspaceMemberTable } from "./workspace-member-table";

export interface WorkspaceMemberPanelProps {
    workspaceId: string;
    title?: string;
    description?: string;
    initialMembers?: WorkspaceMemberItem[];
    currentUserId?: string;
    onInviteMember?: () => void;
    onRoleChange?: (member: WorkspaceMemberItem, newRole: string) => void;
    onRemoveMember?: (member: WorkspaceMemberItem) => void;
    className?: string;
}

export function WorkspaceMemberPanel({
    workspaceId,
    title = "Workspace Members",
    description = "Manage workspace members, assign roles, and invite collaborators to your workspace.",
    initialMembers,
    currentUserId,
    onInviteMember,
    onRoleChange,
    onRemoveMember,
    className = "",
}: WorkspaceMemberPanelProps) {
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

    // Fetch members using TanStack React Query
    const { data, isLoading } = useGetWorkspaceMembers(workspaceId);

    // Use query data if available, fallback to initialMembers or empty list
    const members: WorkspaceMemberItem[] =
        (data?.workspaceMembers as unknown as WorkspaceMemberItem[]) ||
        initialMembers ||
        [];

    const handleOpenInviteDialog = () => {
        if (onInviteMember) {
            onInviteMember();
        } else {
            setIsInviteDialogOpen(true);
        }
    };

    return (
        <div className={`w-full space-y-6 ${className}`}>
            <Card className="border-border shadow-xs">
                <CardHeader className="pb-4 border-b border-border/60">
                    <WorkspaceMemberHeader
                        title={title}
                        description={description}
                        onInviteMember={handleOpenInviteDialog}
                    />
                </CardHeader>

                <CardContent className="pt-6">
                    <WorkspaceMemberTable
                        data={members}
                        isLoading={isLoading && members.length === 0}
                        onRoleChange={onRoleChange}
                        onRemoveMember={onRemoveMember}
                        currentUserId={currentUserId}
                    />
                </CardContent>
            </Card>

            {/* Invite Dialog */}
            <WorkspaceMemberInviteDialog
                workspaceId={workspaceId}
                open={isInviteDialogOpen}
                onOpenChange={setIsInviteDialogOpen}
            />
        </div>
    );
}

export default WorkspaceMemberPanel;
