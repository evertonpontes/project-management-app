"use client";

import {
    RiEditLine,
    RiFileCopyLine,
    RiDeleteBinLine,
    RiMoreFill,
} from "@remixicon/react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import { cn } from "cn";
import type { ProjectItem } from "../types";

export interface ProjectActionsProps {
    project: ProjectItem;
    onUpdate?: (project: ProjectItem) => void;
    onDelete?: (project: ProjectItem) => void;
    asSidebarAction?: boolean;
    className?: string;
}

export function ProjectActions({
    project,
    onUpdate,
    onDelete,
    asSidebarAction = false,
    className = "",
}: ProjectActionsProps) {
    const handleCopyId = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(project.id);
            toast.success("Project ID copied to clipboard!");
        } catch {
            toast.error("Failed to copy project ID.");
        }
    };

    const handleUpdate = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdate?.(project);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(project);
        } else {
            toast.info("Delete project feature coming soon.");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    asSidebarAction ? (
                        <SidebarMenuAction
                            showOnHover
                            title="Project options"
                            aria-label="Project options"
                            className={cn("cursor-pointer", className)}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <RiMoreFill className="size-4" />
                        </SidebarMenuAction>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "size-8 cursor-pointer text-muted-foreground hover:text-foreground",
                                className
                            )}
                            title="Project options"
                            aria-label="Project options"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <RiMoreFill className="size-4" />
                        </Button>
                    )
                }
            />

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleUpdate} className="cursor-pointer">
                    <RiEditLine className="size-4 mr-2" />
                    <span>Edit project</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleCopyId} className="cursor-pointer">
                    <RiFileCopyLine className="size-4 mr-2" />
                    <span>Copy project ID</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleDelete}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <RiDeleteBinLine className="size-4 mr-2" />
                    <span>Delete project</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
