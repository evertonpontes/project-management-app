"use client";

import * as React from "react";
import { useState } from "react";
import { RiAddLine, RiDashboardLine, RiListCheck2, RiTableLine } from "@remixicon/react";
import { TaskStatus } from "@/generated/prisma/enums";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import type { TaskFilters, TaskItem, TaskPaginationInput } from "../types";
import { useGetTasks } from "../hooks";
import { TaskCreateDrawer } from "./task-create-drawer";
import { TaskDetailDrawer } from "./task-detail-drawer";
import { TaskFiltersToolbar } from "./task-filters-toolbar";
import { TaskBoardView } from "./task-board-view";
import { TaskListView } from "./task-list-view";
import { TaskTableView } from "./task-table-view";

interface TaskPanelProps {
    projectId: string;
    projectName?: string;
}

export function TaskPanel({ projectId, projectName }: TaskPanelProps) {
    const [activeTab, setActiveTab] = useState<string>("board");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedStatusForAdd, setSelectedStatusForAdd] = useState<TaskStatus | undefined>(undefined);
    const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<TaskItem | null>(null);

    const [filters, setFilters] = useState<TaskFilters>({
        status: "ALL",
        priority: "ALL",
        type: "ALL",
        search: "",
    });

    const [pagination] = useState<TaskPaginationInput>({
        page: 1,
        rowSize: 50,
    });

    const { data, isLoading } = useGetTasks(projectId, filters, pagination);
    const tasks = data?.tasks || [];

    const handleOpenCreateDrawer = (status?: TaskStatus) => {
        setSelectedStatusForAdd(status);
        setIsCreateOpen(true);
    };

    return (
        <div className="space-y-6" data-slot="task-panel">
            {/* Panel Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Tasks
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {projectName
                            ? `Manage, track and organize tasks for ${projectName}.`
                            : "Manage, track and organize project tasks."}
                    </p>
                </div>

                <Button
                    onClick={() => handleOpenCreateDrawer()}
                    className="gap-2 self-start sm:self-center shadow-xs"
                >
                    <RiAddLine className="size-4" />
                    <span>Add Task</span>
                </Button>
            </div>

            {/* Navigation Tabs and Filters Toolbar */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
            >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-3">
                    <TabsList className="bg-muted/70 p-1 rounded-lg">
                        <TabsTrigger value="board" className="gap-1.5 text-xs font-medium px-3">
                            <RiDashboardLine className="size-3.5" />
                            <span>Board</span>
                        </TabsTrigger>
                        <TabsTrigger value="list" className="gap-1.5 text-xs font-medium px-3">
                            <RiListCheck2 className="size-3.5" />
                            <span>List</span>
                        </TabsTrigger>
                        <TabsTrigger value="table" className="gap-1.5 text-xs font-medium px-3">
                            <RiTableLine className="size-3.5" />
                            <span>Table</span>
                        </TabsTrigger>
                    </TabsList>

                    <TaskFiltersToolbar
                        filters={filters}
                        onFiltersChange={setFilters}
                    />
                </div>

                {isLoading ? (
                    <div className="space-y-3 py-4">
                        <div className="flex gap-4">
                            <Skeleton className="h-64 flex-1 rounded-xl" />
                            <Skeleton className="h-64 flex-1 rounded-xl hidden sm:block" />
                            <Skeleton className="h-64 flex-1 rounded-xl hidden md:block" />
                        </div>
                    </div>
                ) : (
                    <>
                        <TabsContent value="board" className="mt-0 focus-visible:outline-none">
                            <TaskBoardView
                                tasks={tasks}
                                onAddTask={handleOpenCreateDrawer}
                                onTaskClick={setSelectedTaskForDetail}
                            />
                        </TabsContent>

                        <TabsContent value="list" className="mt-0 focus-visible:outline-none">
                            <TaskListView
                                tasks={tasks}
                                onAddTask={handleOpenCreateDrawer}
                                onTaskClick={setSelectedTaskForDetail}
                            />
                        </TabsContent>

                        <TabsContent value="table" className="mt-0 focus-visible:outline-none">
                            <TaskTableView
                                tasks={tasks}
                                onTaskClick={setSelectedTaskForDetail}
                            />
                        </TabsContent>
                    </>
                )}
            </Tabs>

            {/* Create Task Drawer */}
            <TaskCreateDrawer
                projectId={projectId}
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                initialStatus={selectedStatusForAdd}
            />

            {/* View / Edit Task Detail Drawer */}
            <TaskDetailDrawer
                task={selectedTaskForDetail}
                open={Boolean(selectedTaskForDetail)}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedTaskForDetail(null);
                    }
                }}
            />
        </div>
    );
}

export default TaskPanel;
