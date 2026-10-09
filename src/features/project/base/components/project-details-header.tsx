"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    RiArrowLeftLine,
    RiCalendarLine,
    RiCheckLine,
    RiDeleteBinLine,
    RiEditLine,
    RiFolder3Line,
    RiGroupLine,
    RiTaskLine,
    RiUserLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "cn";
import { ProjectUpdateModal } from "./project-update-modal";
import { ProjectDeleteDialog } from "./project-delete-dialog";
import type { ProjectItem } from "../types";

export interface ProjectDetailsHeaderProps {
    project: ProjectItem;
    workspaceId: string;
    className?: string;
}

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

export function ProjectDetailsHeader({
    project,
    workspaceId,
    className = "",
}: ProjectDetailsHeaderProps) {
    const router = useRouter();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const isDone = Boolean(
        project.isDone ||
        project.status?.toUpperCase() === "DONE" ||
        (project.tasks &&
            project.tasks.length > 0 &&
            project.tasks.every((t) => t.status?.toUpperCase() === "DONE"))
    );

    const status = (() => {
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
    })();

    const taskCount = project._count?.tasks ?? (project.tasks?.length ?? 0);
    const completedTasks =
        project.tasks?.filter((t) => t.status?.toUpperCase() === "DONE").length ??
        0;
    const memberCount =
        project._count?.projectMembers ??
        (project.projectMembers?.length ?? 1);

    const ownerInitials = (project.owner?.name || "U")
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const progressPercentage =
        taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : isDone ? 100 : 0;

    return (
        <div className={cn("space-y-6", className)} data-slot="project-details-header">
            {/* Back link & breadcrumbs */}
            <div className="flex items-center justify-between">
                <Link
                    href={`/workspaces/${workspaceId}/projects`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <RiArrowLeftLine className="size-4 transition-transform group-hover:-translate-x-0.5" />
                    <span>Back to projects</span>
                </Link>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={
                            <Link
                                href={`/workspaces/${workspaceId}/projects/${project.id}/members`}
                            />
                        }
                        className="gap-1.5 cursor-pointer"
                    >
                        <RiGroupLine className="size-3.5" />
                        <span>Members</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsUpdateOpen(true)}
                        className="gap-1.5 cursor-pointer"
                    >
                        <RiEditLine className="size-3.5" />
                        <span>Edit</span>
                    </Button>

                    <ProjectDeleteDialog
                        project={project}
                        onSuccess={() => {
                            router.push(`/workspaces/${workspaceId}/projects`);
                        }}
                    >
                        {(confirmDelete, isPending) => (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={confirmDelete}
                                disabled={isPending}
                                className="gap-1.5 cursor-pointer"
                            >
                                <RiDeleteBinLine className="size-3.5" />
                                <span>Delete</span>
                            </Button>
                        )}
                    </ProjectDeleteDialog>
                </div>
            </div>

            {/* Main Project Details Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
                        <RiFolder3Line className="size-6" />
                    </div>
                    <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                                {project.name}
                            </h1>
                            <Badge
                                variant={status.variant}
                                className={cn("text-xs font-medium gap-1", status.className)}
                            >
                                {isDone && (
                                    <RiCheckLine className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                )}
                                <span>{status.label}</span>
                            </Badge>
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                            {project.description ||
                                "Manage tasks, timelines, and team collaboration for this project."}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                            <div className="flex items-center gap-1.5">
                                <RiCalendarLine className="size-3.5 shrink-0 text-muted-foreground" />
                                <span>
                                    {formatDate(project.startDate)} – {formatDate(project.dueDate)}
                                </span>
                            </div>

                            {project.owner && (
                                <div className="flex items-center gap-1.5">
                                    <Avatar className="size-4.5">
                                        {project.owner.image && (
                                            <AvatarImage
                                                src={project.owner.image}
                                                alt={project.owner.name}
                                            />
                                        )}
                                        <AvatarFallback className="text-[9px]">
                                            {ownerInitials || <RiUserLine className="size-2.5" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>Owner: {project.owner.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium text-muted-foreground">Total Tasks</p>
                            <p className="text-xl font-bold text-foreground">
                                {taskCount}
                            </p>
                        </div>
                        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <RiTaskLine className="size-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium text-muted-foreground">Completed Tasks</p>
                            <p className="text-xl font-bold text-foreground">
                                {completedTasks}{" "}
                                <span className="text-xs font-normal text-muted-foreground">
                                    ({progressPercentage}%)
                                </span>
                            </p>
                        </div>
                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <RiCheckLine className="size-5" />
                        </div>
                    </CardContent>
                </Card>

                <Link
                    href={`/workspaces/${workspaceId}/projects/${project.id}/members`}
                    className="group"
                >
                    <Card className="border-border/60 bg-card/60 backdrop-blur-xs transition-colors hover:border-border hover:bg-card">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                    Team Members
                                </p>
                                <p className="text-xl font-bold text-foreground">
                                    {memberCount}
                                </p>
                            </div>
                            <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                                <RiGroupLine className="size-5" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <ProjectUpdateModal
                project={project}
                open={isUpdateOpen}
                onOpenChange={setIsUpdateOpen}
            />
        </div>
    );
}
