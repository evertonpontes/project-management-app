"use client";

import * as React from "react";
import { useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import { TaskStatus } from "@/generated/prisma/enums";

import type { TaskItem } from "../types";
import { TASK_STATUS_OPTIONS } from "../types";
import { TaskBoardColumn } from "./task-board-column";
import { TaskBoardCard } from "./task-board-card";

interface TaskBoardViewProps {
    tasks: TaskItem[];
    onAddTask?: (status: TaskStatus) => void;
    onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

export function TaskBoardView({
    tasks: initialTasks,
    onAddTask,
    onStatusChange,
}: TaskBoardViewProps) {
    const [draggedOverrides, setDraggedOverrides] = useState<Record<string, TaskStatus>>({});
    const [activeTask, setActiveTask] = useState<TaskItem | null>(null);

    const tasks = React.useMemo(() => {
        return initialTasks.map((t) => {
            if (draggedOverrides[t.id]) {
                return { ...t, status: draggedOverrides[t.id] };
            }
            return t;
        });
    }, [initialTasks, draggedOverrides]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeTaskId = String(active.id);
        const currentTask = tasks.find((t) => t.id === activeTaskId);
        if (!currentTask) return;

        // The drop target might be a column (over.id in TaskStatus) or another card
        let targetStatus: TaskStatus | null = null;

        const isStatusColumn = Object.values(TaskStatus).includes(over.id as TaskStatus);
        if (isStatusColumn) {
            targetStatus = over.id as TaskStatus;
        } else {
            // Check if dropped over another card
            const overTask = tasks.find((t) => t.id === over.id);
            if (overTask) {
                targetStatus = overTask.status;
            }
        }

        if (targetStatus && targetStatus !== currentTask.status) {
            // Optimistically update local state for immediate response
            setDraggedOverrides((prev) => ({
                ...prev,
                [activeTaskId]: targetStatus,
            }));

            // Notify parent / trigger action if provided
            onStatusChange?.(activeTaskId, targetStatus);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[500px]">
                {TASK_STATUS_OPTIONS.map((statusOption) => {
                    const columnTasks = tasks.filter((t) => t.status === statusOption.value);

                    return (
                        <TaskBoardColumn
                            key={statusOption.value}
                            status={statusOption.value as TaskStatus}
                            title={statusOption.label}
                            dotColor={statusOption.color}
                            tasks={columnTasks}
                            onAddTask={onAddTask}
                        />
                    );
                })}
            </div>

            <DragOverlay>
                {activeTask ? <TaskBoardCard task={activeTask} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
}

export default TaskBoardView;
