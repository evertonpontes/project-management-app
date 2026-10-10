"use client";

import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { RiCalendarLine } from "@remixicon/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { TaskItem } from "../types";
import { TaskPriorityBadge } from "./task-priority-badge";
import { TaskProgressBar } from "./task-progress-bar";

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
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: task.id,
        data: {
            task,
            status: task.status,
        },
        disabled: isOverlay,
    });

    const style: React.CSSProperties = {
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        opacity: isDragging ? 0.35 : 1,
        cursor: isOverlay ? "grabbing" : "grab",
    };

    const handleClick = () => {
        if (!isDragging && onTaskClick) {
            onTaskClick(task);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            className={`group rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:shadow-sm hover:border-primary/40 transition-all select-none cursor-pointer ${
                isOverlay ? "shadow-lg rotate-1 ring-2 ring-primary/40 cursor-grabbing" : ""
            }`}
        >
            {/* Top row: Priority badge */}
            <div className="flex items-center justify-between mb-2">
                <TaskPriorityBadge priority={task.priority} />
                {task.type && (
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground/80 tracking-wider">
                        {task.type}
                    </span>
                )}
            </div>

            {/* Task title */}
            <h4 className="text-sm font-semibold text-foreground tracking-tight line-clamp-2 mb-1">
                {task.title}
            </h4>

            {/* Description */}
            {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {task.description}
                </p>
            )}

            {/* Bottom metadata */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground mt-2">
                {/* Due Date */}
                {task.dueDate ? (
                    <div className="flex items-center gap-1 text-[11px]">
                        <RiCalendarLine className="size-3 text-muted-foreground" />
                        <span>{formatDate(task.dueDate)}</span>
                    </div>
                ) : (
                    <div />
                )}

                <div className="flex items-center gap-2">
                    {/* Progress */}
                    {task.progress !== undefined && task.progress > 0 && (
                        <TaskProgressBar progress={task.progress} showText={false} className="w-10 min-w-10" />
                    )}

                    {/* Assignee */}
                    {task.assignedTo && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Avatar className="size-5 ring-1 ring-background cursor-pointer">
                                            <AvatarImage src={task.assignedTo.image ?? undefined} />
                                            <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-semibold">
                                                {task.assignedTo.name?.slice(0, 2).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    }
                                />
                                <TooltipContent>
                                    <p className="text-xs">{task.assignedTo.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskBoardCard;
