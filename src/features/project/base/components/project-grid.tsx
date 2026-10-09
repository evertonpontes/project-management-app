"use client";

import { RiAddLine, RiFolderLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProjectCard } from "./project-card";
import type { ProjectItem } from "../types";

export interface ProjectGridProps {
    projects: ProjectItem[];
    workspaceId: string;
    isLoading?: boolean;
    onAddProject?: () => void;
    onUpdateProject?: (project: ProjectItem) => void;
    onDeleteProject?: (project: ProjectItem) => void;
    className?: string;
}

export function ProjectGrid({
    projects,
    workspaceId,
    isLoading = false,
    onAddProject,
    onUpdateProject,
    onDeleteProject,
    className = "",
}: ProjectGridProps) {
    if (isLoading) {
        return (
            <div
                className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
                data-slot="project-grid-skeleton"
            >
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden border-border bg-card">
                        <Skeleton className="h-1 w-full" />
                        <CardHeader className="pt-5 pb-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 w-full">
                                    <Skeleton className="size-10 rounded-lg shrink-0" />
                                    <div className="space-y-1.5 w-full">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2 pb-5">
                            <div className="border-t border-border/50 pt-3 flex items-center justify-between">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div
                className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-10 text-center sm:p-14 ${className}`}
                data-slot="project-grid-empty"
            >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-xs">
                    <RiFolderLine className="size-7" />
                </div>
                <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    No projects found
                </h3>
                <p className="mt-1.5 max-w-sm text-xs text-muted-foreground sm:text-sm">
                    No projects have been created in this workspace yet. Create your first project to start organizing tasks.
                </p>
                {onAddProject && (
                    <Button onClick={onAddProject} className="mt-5 gap-2 cursor-pointer shadow-xs">
                        <RiAddLine className="size-4" />
                        <span>Create first project</span>
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
            data-slot="project-grid"
        >
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    workspaceId={workspaceId}
                    onUpdate={onUpdateProject}
                    onDelete={onDeleteProject}
                />
            ))}
        </div>
    );
}
