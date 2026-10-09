"use client";

import * as React from "react";
import { RiAddLine, RiCalendarLine, RiTaskLine } from "@remixicon/react";
import { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { TaskItem } from "../types";
import { TASK_STATUS_OPTIONS } from "../types";

interface TaskListViewProps {
    tasks: TaskItem[];
    onAddTask?: (status: TaskStatus) => void;
}

const priorityDotColors: Record<string, string> = {
    [TaskPriority.LOW]: "bg-blue-500",
    [TaskPriority.MEDIUM]: "bg-amber-500",
    [TaskPriority.HIGH]: "bg-rose-500",
    [TaskPriority.CRITICAL]: "bg-purple-600",
};

function formatDate(dateInput?: Date | string | null): string {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TaskListView({ tasks, onAddTask }: TaskListViewProps) {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/10 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-3">
                    <RiTaskLine className="size-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">No tasks found</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                    No tasks match your current criteria. Create a new task to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {TASK_STATUS_OPTIONS.map((statusOption) => {
                const groupTasks = tasks.filter((t) => t.status === statusOption.value);

                return (
                    <div
                        key={statusOption.value}
                        className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs"
                    >
                        {/* Group Header */}
                        <div className="flex items-center justify-between border-b border-border/80 bg-muted/20 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-foreground">
                                    {statusOption.label}
                                </h3>
                                <Badge
                                    variant="secondary"
                                    className="rounded-full px-2 py-0 text-xs font-semibold"
                                >
                                    {groupTasks.length}
                                </Badge>
                            </div>

                            {onAddTask && (
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="text-muted-foreground hover:text-foreground size-7 rounded-md"
                                    onClick={() => onAddTask(statusOption.value as TaskStatus)}
                                    title={`Add task to ${statusOption.label}`}
                                >
                                    <RiAddLine className="size-4" />
                                </Button>
                            )}
                        </div>

                        {/* Group Tasks List */}
                        {groupTasks.length === 0 ? (
                            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                                No tasks in {statusOption.label.toLowerCase()}
                            </div>
                        ) : (
                            <div className="divide-y divide-border/60">
                                {groupTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                                    >
                                        {/* Left: Dot & Title/Description */}
                                        <div className="flex items-start gap-3 min-w-0 flex-1">
                                            <span
                                                className={`size-2 rounded-full shrink-0 mt-1.5 ${
                                                    priorityDotColors[task.priority] || "bg-slate-400"
                                                }`}
                                            />
                                            <div className="space-y-0.5 min-w-0 flex-1">
                                                <h4 className="text-sm font-medium text-foreground tracking-tight line-clamp-1">
                                                    {task.title}
                                                </h4>
                                                {task.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {task.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Due Date, Assignees, Progress */}
                                        <div className="flex items-center gap-4 shrink-0 sm:self-center pl-5 sm:pl-0">
                                            {/* Due Date */}
                                            {task.dueDate ? (
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-16">
                                                    <RiCalendarLine className="size-3.5" />
                                                    <span>{formatDate(task.dueDate)}</span>
                                                </div>
                                            ) : (
                                                <div className="min-w-16" />
                                            )}

                                            {/* Assignee Avatar */}
                                            <div className="w-8 flex justify-center">
                                                {task.assignedTo ? (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                render={
                                                                    <Avatar className="size-6 ring-2 ring-background cursor-pointer">
                                                                        <AvatarImage
                                                                            src={task.assignedTo.image ?? undefined}
                                                                        />
                                                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                                                                            {task.assignedTo.name
                                                                                ?.slice(0, 2)
                                                                                .toUpperCase() || "U"}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                }
                                                            />
                                                            <TooltipContent>
                                                                <p className="text-xs">{task.assignedTo.name}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                ) : (
                                                    <div className="size-6 rounded-full border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground">
                                                        -
                                                    </div>
                                                )}
                                            </div>

                                            {/* Progress percentage */}
                                            <div className="text-xs text-muted-foreground font-medium w-9 text-right">
                                                {task.progress ?? 0}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default TaskListView;
