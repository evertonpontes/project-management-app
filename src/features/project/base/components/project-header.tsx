"use client";

import { RiAddLine, RiFolderLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ProjectHeaderProps {
    title?: string;
    description?: string;
    totalProjects?: number;
    onAddProject: () => void;
    className?: string;
}

export function ProjectHeader({
    title = "Projects",
    description = "Manage and collaborate on projects within this workspace.",
    totalProjects,
    onAddProject,
    className = "",
}: ProjectHeaderProps) {
    return (
        <div
            className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
            data-slot="project-header"
        >
            <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <RiFolderLine className="size-5" />
                    </div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                            {title}
                        </h1>
                        {typeof totalProjects === "number" && (
                            <Badge variant="secondary" className="font-semibold text-xs">
                                {totalProjects}
                            </Badge>
                        )}
                    </div>
                </div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                    {description}
                </p>
            </div>

            <Button
                onClick={onAddProject}
                className="gap-2 self-start sm:self-auto cursor-pointer shadow-xs"
            >
                <RiAddLine className="size-4" />
                <span>New Project</span>
            </Button>
        </div>
    );
}
