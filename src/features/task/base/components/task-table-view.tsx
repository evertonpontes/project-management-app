"use client";

import * as React from "react";
import { RiCalendarLine, RiTaskLine } from "@remixicon/react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { TaskItem } from "../types";
import { TaskStatusBadge } from "./task-status-badge";
import { TaskPriorityBadge } from "./task-priority-badge";
import { TaskProgressBar } from "./task-progress-bar";

interface TaskTableViewProps {
    tasks: TaskItem[];
}

function formatDate(dateInput?: Date | string | null): string {
    if (!dateInput) return "-";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TaskTableView({ tasks }: TaskTableViewProps) {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/10 py-16 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-3">
                    <RiTaskLine className="size-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">No tasks found</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                    No tasks match your current filters. Try adjusting your search or add a new task.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[38%] font-semibold text-xs text-foreground">Task</TableHead>
                        <TableHead className="w-[12%] font-semibold text-xs text-foreground">Status</TableHead>
                        <TableHead className="w-[12%] font-semibold text-xs text-foreground">Priority</TableHead>
                        <TableHead className="w-[12%] font-semibold text-xs text-foreground">Assignees</TableHead>
                        <TableHead className="w-[12%] font-semibold text-xs text-foreground">Due date</TableHead>
                        <TableHead className="w-[14%] font-semibold text-xs text-foreground">Progress</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id} className="hover:bg-muted/40 transition-colors">
                            {/* Task Title & Description */}
                            <TableCell className="py-3.5">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium text-foreground tracking-tight line-clamp-1">
                                        {task.title}
                                    </p>
                                    {task.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                            {task.description}
                                        </p>
                                    )}
                                </div>
                            </TableCell>

                            {/* Status */}
                            <TableCell className="py-3.5">
                                <TaskStatusBadge status={task.status} />
                            </TableCell>

                            {/* Priority */}
                            <TableCell className="py-3.5">
                                <TaskPriorityBadge priority={task.priority} />
                            </TableCell>

                            {/* Assignee */}
                            <TableCell className="py-3.5">
                                {task.assignedTo ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger
                                                render={
                                                    <div className="flex items-center cursor-pointer">
                                                        <Avatar className="size-6 ring-2 ring-background">
                                                            <AvatarImage src={task.assignedTo.image ?? undefined} />
                                                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                                                                {task.assignedTo.name?.slice(0, 2).toUpperCase() || "U"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                }
                                            />
                                            <TooltipContent>
                                                <p className="text-xs">{task.assignedTo.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                )}
                            </TableCell>

                            {/* Due Date */}
                            <TableCell className="py-3.5">
                                {task.dueDate ? (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <RiCalendarLine className="size-3.5" />
                                        <span>{formatDate(task.dueDate)}</span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                )}
                            </TableCell>

                            {/* Progress */}
                            <TableCell className="py-3.5">
                                <TaskProgressBar progress={task.progress} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default TaskTableView;
