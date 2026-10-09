"use client";

import { useMemo } from "react";
import {
    RiCalendarLine,
    RiCheckLine,
    RiFolder3Line,
    RiGroupLine,
    RiTaskLine,
    RiUserLine,
} from "@remixicon/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "cn";
import { ProjectActions } from "./project-actions";
import { ProjectDeleteDialog } from "./project-delete-dialog";
import type { ProjectItem } from "../types";

export interface ProjectCardProps {
    project: ProjectItem;
    workspaceId: string;
    onUpdate?: (project: ProjectItem) => void;
    onDelete?: (project: ProjectItem) => void;
    className?: string;
}

const COLOR_PALETTES = [
    {
        iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        badgeBg: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        accentBar: "bg-blue-500",
    },
    {
        iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        accentBar: "bg-emerald-500",
    },
    {
        iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        badgeBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
        accentBar: "bg-purple-500",
    },
    {
        iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        accentBar: "bg-amber-500",
    },
    {
        iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
        badgeBg: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        accentBar: "bg-rose-500",
    },
    {
        iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
        badgeBg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        accentBar: "bg-indigo-500",
    },
    {
        iconBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
        badgeBg: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
        accentBar: "bg-cyan-500",
    },
];

function formatDate(dateValue?: Date | string | null): string {
    if (!dateValue) return "No date";
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function ProjectCard({
    project,
    onUpdate,
    onDelete,
    className = "",
}: ProjectCardProps) {
    const palette = useMemo(() => {
        let hash = 0;
        const key = project.id || project.name;
        for (let i = 0; i < key.length; i++) {
            hash = (hash << 5) - hash + key.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % COLOR_PALETTES.length;
        return COLOR_PALETTES[index];
    }, [project.id, project.name]);

    const isDone = useMemo(() => {
        if (project.isDone) return true;
        if (project.status?.toUpperCase() === "DONE") return true;
        if (
            project.tasks &&
            project.tasks.length > 0 &&
            project.tasks.every(
                (t) => t.status?.toUpperCase() === "DONE"
            )
        ) {
            return true;
        }
        return false;
    }, [project.isDone, project.status, project.tasks]);

    const status = useMemo(() => {
        if (isDone) {
            return {
                label: "Done",
                variant: "outline" as const,
                className:
                    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
            };
        }

        const now = new Date();
        const start = new Date(project.startDate);
        const due = new Date(project.dueDate);

        if (!isNaN(due.getTime()) && now > due) {
            return {
                label: "Overdue",
                variant: "destructive" as const,
                className: "",
            };
        }
        if (!isNaN(start.getTime()) && now < start) {
            return {
                label: "Upcoming",
                variant: "secondary" as const,
                className: "",
            };
        }
        return {
            label: "In Progress",
            variant: "default" as const,
            className: "",
        };
    }, [isDone, project.startDate, project.dueDate]);

    const taskCount = project._count?.tasks ?? (project.tasks?.length ?? 0);
    const memberCount =
        project._count?.projectMembers ?? (project.projectMembers?.length ?? 1);
    const completedTasks =
        project.tasks?.filter((t) => t.status?.toUpperCase() === "DONE").length ??
        0;

    const ownerInitials = (project.owner?.name || "U")
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <Card
            className={`group relative overflow-hidden border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-md ${className}`}
        >
            <div className={`absolute top-0 inset-x-0 h-1 ${palette.accentBar}`} />

            <CardHeader className="pt-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${palette.iconBg}`}
                        >
                            <RiFolder3Line className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <h3
                                className="truncate font-semibold text-base text-foreground tracking-tight group-hover:text-primary transition-colors"
                                title={project.name}
                            >
                                {project.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                <RiCalendarLine className="size-3.5 shrink-0" />
                                <span>{formatDate(project.startDate)} – {formatDate(project.dueDate)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        <Badge
                            variant={status.variant}
                            className={cn("text-[11px] font-medium gap-1", status.className)}
                        >
                            {isDone && (
                                <RiCheckLine className="size-3 text-emerald-600 dark:text-emerald-400" />
                            )}
                            <span>{status.label}</span>
                        </Badge>
                        <ProjectDeleteDialog
                            project={project}
                            onSuccess={() => onDelete?.(project)}
                        >
                            {(confirmDelete) => (
                                <ProjectActions
                                    project={project}
                                    onUpdate={onUpdate}
                                    onDelete={confirmDelete}
                                />
                            )}
                        </ProjectDeleteDialog>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-2 pb-5 space-y-3">
                <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <RiTaskLine className="size-3.5" />
                            <span>
                                <strong className="font-medium text-foreground">
                                    {completedTasks > 0 && isDone
                                        ? `${completedTasks}/${taskCount}`
                                        : taskCount}
                                </strong>{" "}
                                {taskCount === 1 ? "task" : "tasks"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <RiGroupLine className="size-3.5" />
                            <span>
                                <strong className="font-medium text-foreground">{memberCount}</strong> {memberCount === 1 ? "member" : "members"}
                            </span>
                        </div>
                    </div>

                    {project.owner && (
                        <div
                            className="flex items-center gap-1.5 text-xs text-muted-foreground"
                            title={`Owner: ${project.owner.name}`}
                        >
                            <Avatar className="size-5">
                                {project.owner.image && (
                                    <AvatarImage src={project.owner.image} alt={project.owner.name} />
                                )}
                                <AvatarFallback className="text-[10px]">
                                    {ownerInitials || <RiUserLine className="size-3" />}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate max-w-[90px]">{project.owner.name}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
