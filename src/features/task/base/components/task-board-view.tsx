"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { TaskStatus } from "@/generated/prisma/enums";

import {
    Kanban,
    KanbanBoard,
    KanbanOverlay,
    type KanbanCommitMeta,
} from "@/components/reui/kanban";

import type { TaskItem } from "../types";
import { TASK_STATUS_OPTIONS } from "../types";
import { TaskBoardColumn } from "./task-board-column";
import { TaskBoardCard } from "./task-board-card";

interface TaskBoardViewProps {
    tasks: TaskItem[];
    onAddTask?: (status: TaskStatus) => void;
    onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
    onTaskClick?: (task: TaskItem) => void;
}

function groupTasksByStatus(tasks: TaskItem[]): Record<string, TaskItem[]> {
    const grouped: Record<string, TaskItem[]> = {
        [TaskStatus.TODO]: [],
        [TaskStatus.IN_PROGRESS]: [],
        [TaskStatus.IN_REVIEW]: [],
        [TaskStatus.DONE]: [],
    };

    for (const task of tasks) {
        if (grouped[task.status]) {
            grouped[task.status].push(task);
        } else {
            grouped[task.status] = [task];
        }
    }

    return grouped;
}

export function TaskBoardView({
    tasks: initialTasks,
    onAddTask,
    onStatusChange,
    onTaskClick,
}: TaskBoardViewProps) {
    const [prevInitialTasks, setPrevInitialTasks] = useState(initialTasks);
    const [columns, setColumns] = useState<Record<string, TaskItem[]>>(() =>
        groupTasksByStatus(initialTasks)
    );

    // Keep columns in sync when initialTasks prop updates
    if (initialTasks !== prevInitialTasks) {
        setPrevInitialTasks(initialTasks);
        setColumns(groupTasksByStatus(initialTasks));
    }

    const handleValueCommit = useCallback(
        (
            finalValue: Record<string, TaskItem[]>,
            meta: KanbanCommitMeta<TaskItem>
        ) => {
            if (meta.kind === "item" && meta.activeContainer !== meta.overContainer) {
                const activeTaskId = String(meta.event.active.id);
                const targetStatus = meta.overContainer as TaskStatus;

                // Optimistically update the moved task's status in local state
                setColumns((prev) => {
                    const next = { ...prev };
                    if (next[targetStatus]) {
                        next[targetStatus] = next[targetStatus].map((t) =>
                            t.id === activeTaskId ? { ...t, status: targetStatus } : t
                        );
                    }
                    return next;
                });

                // Notify parent / trigger action if provided
                onStatusChange?.(activeTaskId, targetStatus);
            }
        },
        [onStatusChange]
    );

    return (
        <Kanban
            value={columns}
            onValueChange={setColumns}
            getItemValue={(task) => task.id}
            onValueCommit={handleValueCommit}
            restoreOnCancel
        >
            <KanbanBoard className="flex sm:flex flex-nowrap sm:grid-cols-none gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[500px]">
                {TASK_STATUS_OPTIONS.map((statusOption) => {
                    const statusKey = statusOption.value as TaskStatus;
                    const columnTasks = columns[statusKey] ?? [];

                    return (
                        <TaskBoardColumn
                            key={statusOption.value}
                            status={statusKey}
                            title={statusOption.label}
                            dotColor={statusOption.color}
                            tasks={columnTasks}
                            onAddTask={onAddTask}
                            onTaskClick={onTaskClick}
                        />
                    );
                })}
            </KanbanBoard>

            <KanbanOverlay className="w-[316px] pointer-events-none">
                {({ value, variant }) => {
                    if (variant === "item") {
                        const allTasks = Object.values(columns).flat();
                        const activeTask = allTasks.find((t) => t.id === value);
                        return activeTask ? (
                            <TaskBoardCard task={activeTask} isOverlay />
                        ) : null;
                    }
                    return null;
                }}
            </KanbanOverlay>
        </Kanban>
    );
}

export default TaskBoardView;
