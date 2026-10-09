"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetProjectMembers } from "../hooks";
import { ProjectMemberItem } from "../types";
import { ProjectMemberHeader } from "./project-member-header";
import { ProjectMemberInviteDialog } from "./project-member-invite-dialog";
import { ProjectMemberTable } from "./project-member-table";

export interface ProjectMemberPanelProps {
    projectId: string;
    workspaceId?: string;
    title?: string;
    description?: string;
    initialMembers?: ProjectMemberItem[];
    currentUserId?: string;
    onInviteMember?: () => void;
    onRoleChange?: (member: ProjectMemberItem, newRole: string) => void;
    onRemoveMember?: (member: ProjectMemberItem) => void;
    className?: string;
}

export function ProjectMemberPanel({
    projectId,
    title = "Project Members",
    description = "Manage project members, assign roles, and collaborate on this project.",
    initialMembers,
    currentUserId,
    onInviteMember,
    onRoleChange,
    onRemoveMember,
    className = "",
}: ProjectMemberPanelProps) {
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

    const { data, isLoading } = useGetProjectMembers(projectId);

    const members: ProjectMemberItem[] =
        (data?.projectMembers as unknown as ProjectMemberItem[]) ||
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
        <div className={`w-full space-y-6 ${className}`} data-slot="project-member-panel">
            <Card className="border-border shadow-xs">
                <CardHeader className="pb-4 border-b border-border/60">
                    <ProjectMemberHeader
                        title={title}
                        description={description}
                        onInviteMember={handleOpenInviteDialog}
                    />
                </CardHeader>

                <CardContent className="pt-6">
                    <ProjectMemberTable
                        data={members}
                        isLoading={isLoading && members.length === 0}
                        onRoleChange={onRoleChange}
                        onRemoveMember={onRemoveMember}
                        currentUserId={currentUserId}
                    />
                </CardContent>
            </Card>

            <ProjectMemberInviteDialog
                projectId={projectId}
                open={isInviteDialogOpen}
                onOpenChange={setIsInviteDialogOpen}
            />
        </div>
    );
}

export default ProjectMemberPanel;
