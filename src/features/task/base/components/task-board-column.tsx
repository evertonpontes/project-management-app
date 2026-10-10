"use client";

import * as React from "react";
import { RiAddLine } from "@remixicon/react";
import { TaskStatus } from "@/generated/prisma/enums";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    KanbanColumn,
    KanbanColumnContent,
    KanbanItem,
    KanbanItemHandle,
} from "@/components/reui/kanban";

import type { TaskItem } from "../types";
import { TaskBoardCard } from "./task-board-card";

interface TaskBoardColumnProps {
    status: TaskStatus;
    title: string;
    dotColor?: string;
    tasks: TaskItem[];
    onAddTask?: (status: TaskStatus) => void;
    onTaskClick?: (task: TaskItem) => void;
}

export function TaskBoardColumn({
    status,
    title,
    dotColor = "bg-slate-400",
    tasks,
    onAddTask,
    onTaskClick,
}: TaskBoardColumnProps) {
    return (
        <KanbanColumn
            value={status}
            className="flex flex-col flex-1 min-w-[280px] max-w-[340px] rounded-xl border border-border/80 bg-muted/20 p-3 transition-colors"
        >
            {/* Column Header - without KanbanColumnHandle so column is not draggable */}
            <div className="flex items-center justify-between px-1 py-1 mb-3">
                <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${dotColor}`} />
                    <h3 className="text-sm font-semibold text-foreground tracking-tight">
                        {title}
                    </h3>
                    <Badge
                        variant="secondary"
                        className="rounded-full px-2 py-0 text-xs font-semibold"
                    >
                        {tasks.length}
                    </Badge>
                </div>

                {onAddTask && (
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-7 rounded-md text-muted-foreground hover:text-foreground"
                        onClick={() => onAddTask(status)}
                        title={`Add task to ${title}`}
                    >
                        <RiAddLine className="size-4" />
                    </Button>
                )}
            </div>

            {/* Cards container */}
            <KanbanColumnContent
                value={status}
                className="flex flex-col gap-2.5 flex-1 min-h-32 overflow-y-auto pr-0.5"
            >
                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 rounded-lg border border-dashed border-border/60 py-8 text-center text-xs text-muted-foreground">
                        <span>Drop tasks here</span>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <KanbanItem key={task.id} value={task.id}>
                            <KanbanItemHandle>
                                <TaskBoardCard
                                    task={task}
                                    onTaskClick={onTaskClick}
                                />
                            </KanbanItemHandle>
                        </KanbanItem>
                    ))
                )}
            </KanbanColumnContent>
        </KanbanColumn>
    );
}

export default TaskBoardColumn;
