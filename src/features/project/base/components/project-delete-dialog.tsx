"use client";

import React from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteProject } from "../hooks";
import type { ProjectItem } from "../types";

export interface ProjectDeleteDialogProps {
    project: ProjectItem;
    onSuccess?: () => void;
    children?:
        | React.ReactNode
        | ((confirmDelete: () => Promise<void>, isPending: boolean) => React.ReactNode);
}

export function ProjectDeleteDialog({
    project,
    onSuccess,
    children,
}: ProjectDeleteDialogProps) {
    const { action } = useDeleteProject(
        project.id,
        project.workspaceId,
        onSuccess
    );

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Project?",
        `Are you sure you want to delete "${project.name}"? This action cannot be undone and carries high risk: all tasks, subtasks, activities, and member assignments in this project will be permanently erased.`,
        "destructive"
    );

    const handleConfirmDelete = async () => {
        const ok = await confirm();
        if (ok) {
            await action.executeAsync({ id: project.id });
        }
    };

    return (
        <>
            <ConfirmDialog />
            {typeof children === "function"
                ? children(handleConfirmDelete, action.isPending)
                : children}
        </>
    );
}

export const ProjectDeleteAlert = ProjectDeleteDialog;

