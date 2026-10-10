"use client";

import * as React from "react";
import {
    RiCalendarLine,
    RiAttachment2,
    RiChat3Line,
} from "@remixicon/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import type { TaskItem } from "../types";
import { TaskPriorityBadge } from "./task-priority-badge";

interface TaskBoardCardProps {
    task: TaskItem;
    isOverlay?: boolean;
    onTaskClick?: (task: TaskItem) => void;
}

function formatDate(dateInput?: Date | string | null): string {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TaskBoardCard({
    task,
    isOverlay = false,
    onTaskClick,
}: TaskBoardCardProps) {
    const handleClick = () => {
        if (onTaskClick) {
            onTaskClick(task);
        }
    };

    const subtasks = task.subTasks ?? [];
    const hasSubtasks = subtasks.length > 0;
    const completedCount = subtasks.filter((st) => st.isCompleted).length;
    const progress = hasSubtasks
        ? Math.round((completedCount / subtasks.length) * 100)
        : (task.progress ?? 0);

    return (
        <div
            onClick={handleClick}
            className={`group rounded-2xl border border-border/80 bg-card p-4 shadow-2xs hover:shadow-sm hover:border-primary/40 transition-all select-none cursor-pointer ${
                isOverlay
                    ? "shadow-lg rotate-1 ring-2 ring-primary/40 cursor-grabbing"
                    : ""
            }`}
        >
            {/* Task title */}
            <h4 className="text-sm font-bold text-foreground tracking-tight line-clamp-2">
                {task.title}
            </h4>

            {/* Description */}
            {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {task.description}
                </p>
            )}

            {/* Middle row: Assignee avatar(s) & Progress circle */}
            <div className="flex items-center justify-between mt-3 min-h-6">
                <div className="flex items-center -space-x-1.5">
                    {task.assignedTo ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Avatar className="size-6 ring-2 ring-card cursor-pointer">
                                            <AvatarImage
                                                src={
                                                    task.assignedTo.image ??
                                                    undefined
                                                }
                                            />
                                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                                                {task.assignedTo.name
                                                    ?.slice(0, 2)
                                                    .toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    }
                                />
                                <TooltipContent>
                                    <p className="text-xs">
                                        {task.assignedTo.name}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <div />
                    )}
                </div>

                {/* Circular progress pill - ONLY shown when task has subtasks */}
                {hasSubtasks && (
                    <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background/50 px-2.5 py-0.5 shadow-2xs">
                        <svg
                            className="size-3.5 -rotate-90 text-muted-foreground"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                                className="stroke-muted-foreground/20"
                                strokeWidth="3.5"
                                fill="none"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                                className="stroke-foreground transition-all duration-300"
                                strokeWidth="3.5"
                                strokeDasharray={2 * Math.PI * 9}
                                strokeDashoffset={
                                    2 * Math.PI * 9 * (1 - progress / 100)
                                }
                                strokeLinecap="round"
                                fill="none"
                            />
                        </svg>
                        <span className="text-[11px] font-medium text-muted-foreground">
                            {progress}%
                        </span>
                    </div>
                )}
            </div>

            {/* Subtle Divider */}
            <hr className="border-border/60 my-3" />

            {/* Bottom metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                {/* Priority Badge & Due Date */}
                <div className="flex items-center gap-2">
                    <TaskPriorityBadge priority={task.priority} />

                    {task.dueDate && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-normal">
                            <RiCalendarLine className="size-3.5 text-muted-foreground" />
                            <span>{formatDate(task.dueDate)}</span>
                        </div>
                    )}
                </div>

                {/* Attachment & Chat counts */}
                <div className="flex items-center gap-2.5 text-muted-foreground">
                    <div className="flex items-center gap-1 text-[11px]">
                        <RiAttachment2 className="size-3.5" />
                        <span>0</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                        <RiChat3Line className="size-3.5" />
                        <span>0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskBoardCard;
