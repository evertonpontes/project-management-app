"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
    RiAddLine,
    RiCalendarLine,
    RiCheckLine,
    RiCloseLine,
    RiDeleteBinLine,
    RiEditLine,
    RiListCheck2,
    RiLoaderLine,
    RiMore2Line,
} from "@remixicon/react";
import { RoleTypes, TaskPriority, TaskStatus } from "@/generated/prisma/enums";

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { useSession } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTask, useUpdateTask } from "../hooks";
import {
    useGetSubtasks,
    useCreateSubtask,
    useUpdateSubtask,
    useDeleteSubtask,
    type SubtaskItem,
} from "@/features/task/subtask";
import type { TaskItem, GetTasksResponse } from "../types";
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "../types";
import { useGetProjectMembers } from "@/features/project/members/hooks";
import { useGetWorkspaceMembers } from "@/features/workspace/members/hooks";
import { TaskStatusBadge } from "./task-status-badge";
import { TaskPriorityBadge } from "./task-priority-badge";
import { TaskProgressBar } from "./task-progress-bar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskDetailDrawerProps {
    task: TaskItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function formatDate(dateInput?: Date | string | null): string {
    if (!dateInput) return "No due date";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "No due date";
    return (
        d.toUTCString().split(d.getFullYear().toString())[0] +
        " " +
        d.getFullYear().toString()
    );
}

function formatDateForInput(dateInput?: unknown): string {
    if (!dateInput) return "";
    if (typeof dateInput === "string") {
        if (/^\d{4}-\d{2}-\d{2}/.test(dateInput)) {
            return dateInput.substring(0, 10);
        }
    }
    const d = new Date(dateInput as string | number | Date);
    if (isNaN(d.getTime())) return "";
    try {
        return d.toISOString().substring(0, 10);
    } catch {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
}

export function TaskDetailDrawer({
    task,
    open,
    onOpenChange,
}: TaskDetailDrawerProps) {
    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    const [prevTaskId, setPrevTaskId] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    if (task && task.id !== prevTaskId) {
        setPrevTaskId(task.id);
        setIsEditMode(false);
    }

    const projectId = task?.projectId || "";
    const workspaceId = task?.project?.workspaceId || "";

    const { data: membersData } = useGetProjectMembers(projectId);
    const members = membersData?.projectMembers ?? [];

    const { data: workspaceMembersData } = useGetWorkspaceMembers(workspaceId);
    const workspaceMembers = workspaceMembersData?.workspaceMembers ?? [];

    const allAssigneeUsers = (() => {
        const list = members.map((m) => m.user);
        if (
            task?.assignedTo &&
            !list.some((u) => u.id === task.assignedTo?.id)
        ) {
            list.push(task.assignedTo);
        }
        return list;
    })();

    // Permission checks:
    const isTaskOwner = Boolean(
        currentUserId && task?.createdById === currentUserId
    );
    const isAssignedUser = Boolean(
        currentUserId && task?.assignedToId === currentUserId
    );
    const isProjectOwner = Boolean(
        currentUserId && task?.project?.ownerId === currentUserId
    );
    const isWorkspaceOwner = Boolean(
        currentUserId && task?.project?.workspace?.ownerId === currentUserId
    );

    const currentProjectMember = members.find(
        (m) => m.userId === currentUserId
    );
    const isProjectAdmin =
        currentProjectMember?.role === RoleTypes.ADMIN ||
        currentProjectMember?.role === RoleTypes.PROJECT_MANAGER;

    const currentWorkspaceMember = workspaceMembers.find(
        (m) => m.userId === currentUserId
    );
    const isWorkspaceAdmin =
        currentWorkspaceMember?.role === RoleTypes.ADMIN ||
        currentWorkspaceMember?.role === RoleTypes.PROJECT_MANAGER;

    // Edit permission: only the task owner or assigned user (or project owner)
    const canEdit = isTaskOwner || isAssignedUser || isProjectOwner;

    // Delete permission: only the owner of the task, and admins or workspace owner
    const canDelete =
        isTaskOwner ||
        isWorkspaceOwner ||
        isProjectOwner ||
        isWorkspaceAdmin ||
        isProjectAdmin;

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Task?",
        `Are you sure you want to delete "${task?.title}"? This action cannot be undone.`,
        "destructive"
    );

    const { action: deleteAction } = useDeleteTask(
        task ? { id: task.id } : undefined,
        task?.projectId,
        () => {
            onOpenChange(false);
        }
    );

    const isDeleting = deleteAction.isPending;

    const handleDelete = async () => {
        if (!task) return;
        const ok = await confirm();
        if (ok) {
            await deleteAction.executeAsync({ id: task.id });
        }
    };

    const {
        form: {
            register,
            setValue,
            watch,
            reset,
            formState: { errors },
        },
        handleSubmitWithAction,
        action,
    } = useUpdateTask(
        task
            ? {
                  id: task.id,
                  projectId: task.projectId,
                  title: task.title,
                  description: task.description || "",
                  status: task.status,
                  priority: task.priority,
                  type: task.type,
                  assignedToId: task.assignedToId || "",
                  dueDate: (formatDateForInput(task.dueDate) ||
                      undefined) as unknown as Date,
              }
            : undefined,
        () => {
            setIsEditMode(false);
        }
    );

    const isPending = action.isPending;
    const selectedStatus = watch("status") || task?.status || TaskStatus.TODO;
    const selectedPriority =
        watch("priority") || task?.priority || TaskPriority.MEDIUM;
    const watchedAssignee = watch("assignedToId");
    const selectedAssignee =
        watchedAssignee !== undefined
            ? watchedAssignee || "UNASSIGNED"
            : task?.assignedToId || "UNASSIGNED";
    const watchedDueDate = watch("dueDate");
    const selectedDueDate =
        watchedDueDate !== undefined
            ? formatDateForInput(watchedDueDate)
            : formatDateForInput(task?.dueDate);

    // Reset drawer form state when task changes or drawer opens (only when not in edit mode)
    useEffect(() => {
        if (open && task && !isEditMode) {
            reset({
                id: task.id,
                projectId: task.projectId,
                title: task.title,
                description: task.description || "",
                status: task.status,
                priority: task.priority,
                type: task.type,
                assignedToId: task.assignedToId || "",
                dueDate: (formatDateForInput(task.dueDate) ||
                    undefined) as unknown as Date,
                startDate: (formatDateForInput(task.startDate) ||
                    undefined) as unknown as Date,
            });
        }
    }, [open, task, isEditMode, reset]);

    const queryClient = useQueryClient();
    const taskId = task?.id ?? "";

    const { data: fetchedSubtasks } = useGetSubtasks(taskId, task?.subTasks);
    const subtasks = fetchedSubtasks ?? task?.subTasks ?? [];

    const completedSubtasksCount = subtasks.filter(
        (st) => st.isCompleted
    ).length;
    const hasSubtasks = subtasks.length > 0;
    const progress = hasSubtasks
        ? Math.round((completedSubtasksCount / subtasks.length) * 100)
        : (task?.progress ?? 0);

    const [subtaskInputTitle, setSubtaskInputTitle] = useState("");
    const [editingSubtask, setEditingSubtask] = useState<SubtaskItem | null>(
        null
    );

    const visibleSubtasks = editingSubtask
        ? subtasks.filter((st) => st.id !== editingSubtask.id)
        : subtasks;

    const { action: createSubtaskHook } = useCreateSubtask(
        task ? { taskId: task.id } : undefined,
        () => setSubtaskInputTitle("")
    );
    const { action: updateSubtaskHook } = useUpdateSubtask(undefined, task?.id);
    const { action: deleteSubtaskHook } = useDeleteSubtask(undefined, task?.id);

    const handleDrawerOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setIsEditMode(false);
            setEditingSubtask(null);
            setSubtaskInputTitle("");
        }
        onOpenChange?.(newOpen);
    };

    const handleToggleSubtask = async (st: SubtaskItem) => {
        if (!canEdit || !task) return;
        const newStatus = !st.isCompleted;

        // 1. Optimistic update in subtasks query cache
        queryClient.setQueryData<SubtaskItem[]>(
            ["subtasks", task.id],
            (old) => {
                if (!old) return old;
                return old.map((item) =>
                    item.id === st.id
                        ? { ...item, isCompleted: newStatus }
                        : item
                );
            }
        );

        // 2. Optimistic update in tasks list query cache
        queryClient.setQueriesData<GetTasksResponse>(
            { queryKey: ["tasks"] },
            (oldData) => {
                if (!oldData?.tasks) return oldData;
                return {
                    ...oldData,
                    tasks: oldData.tasks.map((t) => {
                        if (t.id !== task.id) return t;
                        const updatedSubtasks = (t.subTasks ?? []).map(
                            (item) =>
                                item.id === st.id
                                    ? { ...item, isCompleted: newStatus }
                                    : item
                        );
                        const completed = updatedSubtasks.filter(
                            (s) => s.isCompleted
                        ).length;
                        const newProgress =
                            updatedSubtasks.length > 0
                                ? Math.round(
                                      (completed / updatedSubtasks.length) * 100
                                  )
                                : t.progress;
                        return {
                            ...t,
                            subTasks: updatedSubtasks,
                            progress: newProgress,
                        };
                    }),
                };
            }
        );

        // 3. Persist update to database
        await updateSubtaskHook.executeAsync({
            id: st.id,
            taskId: task.id,
            isCompleted: newStatus,
        });
    };

    const handleStartEditSubtask = (st: SubtaskItem) => {
        setEditingSubtask(st);
        setSubtaskInputTitle(st.title);
    };

    const handleCancelEditSubtask = () => {
        setEditingSubtask(null);
        setSubtaskInputTitle("");
    };

    const handleSubmitSubtask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subtaskInputTitle.trim() || !canEdit || !task) return;
        const trimmedTitle = subtaskInputTitle.trim();

        if (editingSubtask) {
            const subtaskId = editingSubtask.id;

            // Optimistic update
            queryClient.setQueryData<SubtaskItem[]>(
                ["subtasks", task.id],
                (old) => {
                    if (!old) return old;
                    return old.map((item) =>
                        item.id === subtaskId
                            ? { ...item, title: trimmedTitle }
                            : item
                    );
                }
            );

            setEditingSubtask(null);
            setSubtaskInputTitle("");

            await updateSubtaskHook.executeAsync({
                id: subtaskId,
                taskId: task.id,
                title: trimmedTitle,
            });
        } else {
            setSubtaskInputTitle("");
            await createSubtaskHook.executeAsync({
                taskId: task.id,
                title: trimmedTitle,
            });
        }
    };

    const handleDeleteSubtask = async (
        e: React.MouseEvent,
        subtaskId: string
    ) => {
        e.stopPropagation();
        if (!canEdit || !task) return;

        // Optimistic update delete
        queryClient.setQueryData<SubtaskItem[]>(
            ["subtasks", task.id],
            (old) => {
                if (!old) return old;
                return old.filter((item) => item.id !== subtaskId);
            }
        );

        if (editingSubtask?.id === subtaskId) {
            setEditingSubtask(null);
            setSubtaskInputTitle("");
        }

        await deleteSubtaskHook.executeAsync({
            id: subtaskId,
            taskId: task.id,
        });
    };

    const handleStatusChange = (value: unknown) => {
        if (typeof value === "string") {
            setValue("status", value as TaskStatus, { shouldValidate: true });
        }
    };

    const handlePriorityChange = (value: unknown) => {
        if (typeof value === "string") {
            setValue("priority", value as TaskPriority, {
                shouldValidate: true,
            });
        }
    };

    const handleAssigneeChange = (value: unknown) => {
        if (typeof value === "string") {
            setValue("assignedToId", value === "UNASSIGNED" ? null : value, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    if (!task) return null;

    return (
        <>
            <ConfirmDialog />
            <Drawer
                open={open}
                onOpenChange={handleDrawerOpenChange}
                swipeDirection="right"
            >
                <DrawerContent className="flex flex-col justify-between bg-card shadow-2xl p-0 border-border border-l w-full sm:max-w-md h-full">
                    {/* Header */}
                    <DrawerHeader className="flex flex-row justify-between items-center px-6 py-4 border-border/80 border-b text-left">
                        <div>
                            <DrawerTitle className="font-semibold text-foreground text-base tracking-tight">
                                Task Detail
                            </DrawerTitle>
                            <DrawerDescription className="sr-only">
                                View and edit task details
                            </DrawerDescription>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {!isEditMode ? (
                                <>
                                    {canDelete && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger
                                                    render={
                                                        <Button
                                                            variant="outline"
                                                            size="icon-sm"
                                                            disabled={
                                                                isDeleting
                                                            }
                                                            onClick={
                                                                handleDelete
                                                            }
                                                            className="hover:bg-destructive/10 border-border/80 hover:border-destructive/40 rounded-lg size-8 text-muted-foreground hover:text-destructive cursor-pointer"
                                                            aria-label="Delete task"
                                                        >
                                                            {isDeleting ? (
                                                                <RiLoaderLine className="size-4 text-destructive animate-spin" />
                                                            ) : (
                                                                <RiDeleteBinLine className="size-4 text-muted-foreground hover:text-destructive" />
                                                            )}
                                                        </Button>
                                                    }
                                                />
                                                <TooltipContent>
                                                    <p className="text-xs">
                                                        Delete task
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger
                                                render={
                                                    <Button
                                                        variant="outline"
                                                        size="icon-sm"
                                                        disabled={!canEdit}
                                                        onClick={() => {
                                                            if (task) {
                                                                reset({
                                                                    id: task.id,
                                                                    projectId:
                                                                        task.projectId,
                                                                    title: task.title,
                                                                    description:
                                                                        task.description ||
                                                                        "",
                                                                    status: task.status,
                                                                    priority:
                                                                        task.priority,
                                                                    type: task.type,
                                                                    assignedToId:
                                                                        task.assignedToId ||
                                                                        "",
                                                                    dueDate:
                                                                        (formatDateForInput(
                                                                            task.dueDate
                                                                        ) ||
                                                                            undefined) as unknown as Date,
                                                                    startDate:
                                                                        (formatDateForInput(
                                                                            task.startDate
                                                                        ) ||
                                                                            undefined) as unknown as Date,
                                                                });
                                                            }
                                                            setIsEditMode(true);
                                                        }}
                                                        className="border-border/80 rounded-lg size-8 cursor-pointer"
                                                        aria-label="Edit task"
                                                    >
                                                        <RiEditLine className="size-4 text-foreground" />
                                                    </Button>
                                                }
                                            />
                                            {!canEdit && (
                                                <TooltipContent>
                                                    <p className="text-xs">
                                                        Only the task creator or
                                                        assigned user can edit
                                                        this task
                                                    </p>
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        disabled={isPending}
                                        onClick={() => {
                                            setIsEditMode(false);
                                            if (task) {
                                                reset({
                                                    id: task.id,
                                                    projectId: task.projectId,
                                                    title: task.title,
                                                    description:
                                                        task.description || "",
                                                    status: task.status,
                                                    priority: task.priority,
                                                    type: task.type,
                                                    assignedToId:
                                                        task.assignedToId || "",
                                                    dueDate:
                                                        (formatDateForInput(
                                                            task.dueDate
                                                        ) ||
                                                            undefined) as unknown as Date,
                                                    startDate:
                                                        (formatDateForInput(
                                                            task.startDate
                                                        ) ||
                                                            undefined) as unknown as Date,
                                                });
                                            }
                                        }}
                                        className="rounded-lg size-8 text-muted-foreground hover:text-foreground"
                                        aria-label="Cancel editing"
                                    >
                                        <RiCloseLine className="size-5" />
                                    </Button>
                                    <Button
                                        type="submit"
                                        form="update-task-form"
                                        size="icon-sm"
                                        disabled={isPending}
                                        className="bg-foreground hover:bg-foreground/90 rounded-lg size-8 text-background"
                                        aria-label="Save changes"
                                    >
                                        {isPending ? (
                                            <RiLoaderLine className="size-4 animate-spin" />
                                        ) : (
                                            <RiCheckLine className="size-4.5" />
                                        )}
                                    </Button>
                                </>
                            )}
                        </div>
                    </DrawerHeader>

                    {/* Body Content */}
                    <div className="flex-1 space-y-6 px-6 py-5 overflow-y-auto">
                        {/* View Mode vs Edit Mode Form */}
                        {isEditMode ? (
                            <form
                                id="update-task-form"
                                onSubmit={handleSubmitWithAction}
                                className="space-y-4"
                            >
                                {/* Title */}
                                <div className="space-y-1.5">
                                    <label className="font-medium text-foreground text-xs">
                                        Title
                                    </label>
                                    <Input
                                        id="title"
                                        placeholder="Task title"
                                        disabled={isPending}
                                        {...register("title")}
                                    />
                                    {errors.title?.message && (
                                        <p className="text-destructive text-xs">
                                            {errors.title.message}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5">
                                    <label className="font-medium text-foreground text-xs">
                                        Description
                                    </label>
                                    <Textarea
                                        id="description"
                                        placeholder="Add more details..."
                                        rows={3}
                                        disabled={isPending}
                                        {...register("description")}
                                    />
                                    {errors.description?.message && (
                                        <p className="text-destructive text-xs">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="flex justify-between items-center py-1">
                                    <span className="font-medium text-muted-foreground text-xs">
                                        Status
                                    </span>
                                    <div className="w-48">
                                        <Select
                                            value={selectedStatus}
                                            onValueChange={handleStatusChange}
                                            disabled={isPending}
                                        >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue placeholder="Select status">
                                                    {(val: string | null) => {
                                                        const option =
                                                            TASK_STATUS_OPTIONS.find(
                                                                (item) =>
                                                                    item.value ===
                                                                    val
                                                            );
                                                        if (!option) return val;
                                                        return (
                                                            <span className="flex items-center gap-2">
                                                                <span
                                                                    className={`size-2 rounded-full ${option.color}`}
                                                                />
                                                                <span>
                                                                    {
                                                                        option.label
                                                                    }
                                                                </span>
                                                            </span>
                                                        );
                                                    }}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TASK_STATUS_OPTIONS.map(
                                                    (item) => (
                                                        <SelectItem
                                                            key={item.value}
                                                            value={item.value}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <span
                                                                    className={`size-2 rounded-full ${item.color}`}
                                                                />
                                                                <span>
                                                                    {item.label}
                                                                </span>
                                                            </span>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Priority */}
                                <div className="flex justify-between items-center py-1">
                                    <span className="font-medium text-muted-foreground text-xs">
                                        Priority
                                    </span>
                                    <div className="w-48">
                                        <Select
                                            value={selectedPriority}
                                            onValueChange={handlePriorityChange}
                                            disabled={isPending}
                                        >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue placeholder="Select priority">
                                                    {(val: string | null) => {
                                                        const option =
                                                            TASK_PRIORITY_OPTIONS.find(
                                                                (item) =>
                                                                    item.value ===
                                                                    val
                                                            );
                                                        if (!option) return val;
                                                        return (
                                                            <span className="flex items-center gap-2">
                                                                <span
                                                                    className={`size-2 rounded-full ${option.color}`}
                                                                />
                                                                <span>
                                                                    {
                                                                        option.label
                                                                    }
                                                                </span>
                                                            </span>
                                                        );
                                                    }}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TASK_PRIORITY_OPTIONS.map(
                                                    (item) => (
                                                        <SelectItem
                                                            key={item.value}
                                                            value={item.value}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <span
                                                                    className={`size-2 rounded-full ${item.color}`}
                                                                />
                                                                <span>
                                                                    {item.label}
                                                                </span>
                                                            </span>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Due Date */}
                                <div className="flex justify-between items-center py-1">
                                    <span className="font-medium text-muted-foreground text-xs">
                                        Due date
                                    </span>
                                    <div className="w-48">
                                        <Input
                                            id="dueDate"
                                            type="date"
                                            value={selectedDueDate}
                                            onChange={(e) => {
                                                const val =
                                                    e.target.value || null;
                                                setValue(
                                                    "dueDate",
                                                    val as unknown as Date,
                                                    {
                                                        shouldDirty: true,
                                                        shouldValidate: true,
                                                    }
                                                );
                                            }}
                                            className="w-full h-8 text-xs"
                                            disabled={isPending}
                                        />
                                    </div>
                                </div>

                                {/* Assignee */}
                                <div className="flex justify-between items-center py-1">
                                    <span className="font-medium text-muted-foreground text-xs">
                                        Assignees
                                    </span>
                                    <div className="w-48">
                                        <Select
                                            value={selectedAssignee}
                                            onValueChange={handleAssigneeChange}
                                            disabled={isPending}
                                        >
                                            <SelectTrigger className="w-full h-8 text-xs">
                                                <SelectValue placeholder="Pick a member">
                                                    {(val: string | null) => {
                                                        if (
                                                            !val ||
                                                            val === "UNASSIGNED"
                                                        ) {
                                                            return (
                                                                <span className="text-muted-foreground text-xs">
                                                                    Unassigned
                                                                </span>
                                                            );
                                                        }
                                                        const user =
                                                            allAssigneeUsers.find(
                                                                (u) =>
                                                                    u.id === val
                                                            );
                                                        if (!user) {
                                                            return (
                                                                <span className="text-muted-foreground text-xs">
                                                                    Unassigned
                                                                </span>
                                                            );
                                                        }
                                                        return (
                                                            <span className="flex items-center gap-2">
                                                                <Avatar className="size-4">
                                                                    <AvatarImage
                                                                        src={
                                                                            user.image ??
                                                                            undefined
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="bg-primary/10 font-semibold text-[8px] text-primary">
                                                                        {user.name
                                                                            ?.slice(
                                                                                0,
                                                                                2
                                                                            )
                                                                            .toUpperCase() ||
                                                                            "U"}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="font-medium text-foreground text-xs truncate">
                                                                    {user.name}
                                                                </span>
                                                            </span>
                                                        );
                                                    }}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="UNASSIGNED">
                                                    <span className="text-muted-foreground">
                                                        Unassigned
                                                    </span>
                                                </SelectItem>
                                                {allAssigneeUsers.map(
                                                    (user) => (
                                                        <SelectItem
                                                            key={user.id}
                                                            value={user.id}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <Avatar className="size-4">
                                                                    <AvatarImage
                                                                        src={
                                                                            user.image ??
                                                                            undefined
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="bg-primary/10 font-semibold text-[8px] text-primary">
                                                                        {user.name
                                                                            ?.slice(
                                                                                0,
                                                                                2
                                                                            )
                                                                            .toUpperCase() ||
                                                                            "U"}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="truncate">
                                                                    {user.name}
                                                                </span>
                                                            </span>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Progress bar indicator */}
                                {hasSubtasks && (
                                    <div className="flex justify-between items-center py-1">
                                        <span className="font-medium text-muted-foreground text-xs">
                                            Progress
                                        </span>
                                        <div className="w-48">
                                            <TaskProgressBar
                                                progress={progress}
                                                className="justify-end w-full"
                                            />
                                        </div>
                                    </div>
                                )}
                            </form>
                        ) : (
                            <div className="space-y-5">
                                {/* View Mode Title & Description */}
                                <div className="space-y-1.5">
                                    <h3 className="font-bold text-foreground text-lg tracking-tight">
                                        {task.title}
                                    </h3>
                                    {task.description ? (
                                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                                            {task.description}
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground text-xs italic">
                                            No description provided.
                                        </p>
                                    )}
                                </div>

                                {/* View Mode Properties Table */}
                                <div className="space-y-3 pt-1">
                                    {/* Status */}
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-muted-foreground text-xs">
                                            Status
                                        </span>
                                        <TaskStatusBadge status={task.status} />
                                    </div>

                                    {/* Priority */}
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-muted-foreground text-xs">
                                            Priority
                                        </span>
                                        <TaskPriorityBadge
                                            priority={task.priority}
                                        />
                                    </div>

                                    {/* Due date */}
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-muted-foreground text-xs">
                                            Due date
                                        </span>
                                        <div className="flex items-center gap-1.5 font-medium text-foreground text-xs">
                                            <RiCalendarLine className="size-3.5 text-muted-foreground" />
                                            <span>
                                                {formatDate(task.dueDate)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Assignee */}
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-muted-foreground text-xs">
                                            Assignees
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {task.assignedTo ? (
                                                <>
                                                    <Avatar className="ring-1 ring-background size-5">
                                                        <AvatarImage
                                                            src={
                                                                task.assignedTo
                                                                    .image ??
                                                                undefined
                                                            }
                                                        />
                                                        <AvatarFallback className="bg-primary/10 font-medium text-[9px] text-primary">
                                                            {task.assignedTo.name
                                                                ?.slice(0, 2)
                                                                .toUpperCase() ||
                                                                "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-foreground text-xs">
                                                        {task.assignedTo.name}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">
                                                    Unassigned
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    {hasSubtasks && (
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-muted-foreground text-xs">
                                                Progress
                                            </span>
                                            <TaskProgressBar
                                                progress={progress}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <hr className="my-5 border-border/80" />

                        {/* Subtasks Section */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <RiListCheck2 className="size-4 text-muted-foreground" />
                                    <h4 className="font-semibold text-foreground text-xs">
                                        Subtasks
                                    </h4>
                                    <Badge
                                        variant="secondary"
                                        className="px-1.5 py-0 rounded-full text-[10px]"
                                    >
                                        {subtasks.length}
                                    </Badge>
                                </div>
                                <span className="text-muted-foreground text-xs">
                                    {completedSubtasksCount} of{" "}
                                    {subtasks.length} done
                                </span>
                            </div>

                            {/* Subtasks list container */}
                            {visibleSubtasks.length > 0 && (
                                <div className="bg-background/50 border border-border/80 rounded-xl divide-y divide-border/80 overflow-hidden">
                                    {visibleSubtasks.map((st) => (
                                        <div
                                            key={st.id}
                                            className="group flex justify-between items-center hover:bg-muted/40 px-3 py-2.5 text-xs transition-colors"
                                        >
                                            <div className="flex flex-1 items-center gap-2.5 min-w-0">
                                                <button
                                                    type="button"
                                                    disabled={!canEdit}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleSubtask(st);
                                                    }}
                                                    aria-label={
                                                        st.isCompleted
                                                            ? "Mark incomplete"
                                                            : "Mark complete"
                                                    }
                                                    className={`size-4 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                                                        st.isCompleted
                                                            ? "bg-foreground border-foreground text-background"
                                                            : "border-border bg-background hover:border-foreground/60"
                                                    }`}
                                                >
                                                    {st.isCompleted && (
                                                        <RiCheckLine className="size-3" />
                                                    )}
                                                </button>
                                                <span
                                                    onClick={() => {
                                                        if (canEdit) {
                                                            handleToggleSubtask(
                                                                st
                                                            );
                                                        }
                                                    }}
                                                    className={`truncate cursor-pointer select-none ${
                                                        st.isCompleted
                                                            ? "line-through text-muted-foreground"
                                                            : "text-foreground font-medium"
                                                    }`}
                                                >
                                                    {st.title}
                                                </span>
                                            </div>

                                            {canEdit && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        render={
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                className="opacity-0 group-hover:opacity-100 size-7 transition-opacity"
                                                            >
                                                                <RiMore2Line className="size-3.5" />
                                                            </Button>
                                                        }
                                                    />
                                                    <DropdownMenuContent className="w-40">
                                                        <DropdownMenuGroup>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleStartEditSubtask(
                                                                        st
                                                                    )
                                                                }
                                                            >
                                                                Update Subtask
                                                            </DropdownMenuItem>
                                                        </DropdownMenuGroup>
                                                        <DropdownMenuGroup>
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={(e) =>
                                                                    handleDeleteSubtask(
                                                                        e,
                                                                        st.id
                                                                    )
                                                                }
                                                            >
                                                                Delete Subtask
                                                            </DropdownMenuItem>
                                                        </DropdownMenuGroup>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add / Edit subtask input */}
                            {canEdit && (
                                <form
                                    onSubmit={handleSubmitSubtask}
                                    className="flex gap-2 pt-1"
                                >
                                    <Input
                                        placeholder={
                                            editingSubtask
                                                ? "Update subtask title..."
                                                : "Add a subtask..."
                                        }
                                        value={subtaskInputTitle}
                                        onChange={(e) =>
                                            setSubtaskInputTitle(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Escape" &&
                                                editingSubtask
                                            ) {
                                                handleCancelEditSubtask();
                                            }
                                        }}
                                        disabled={
                                            createSubtaskHook.isPending ||
                                            updateSubtaskHook.isPending
                                        }
                                        className="bg-background h-8.5 text-xs"
                                        autoFocus={Boolean(editingSubtask)}
                                    />
                                    {editingSubtask && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={handleCancelEditSubtask}
                                            className="rounded-lg size-8.5 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                                            title="Cancel editing"
                                            aria-label="Cancel editing"
                                        >
                                            <RiCloseLine className="size-4" />
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        size="icon-sm"
                                        disabled={
                                            !subtaskInputTitle.trim() ||
                                            createSubtaskHook.isPending ||
                                            updateSubtaskHook.isPending
                                        }
                                        className="rounded-lg size-8.5 cursor-pointer shrink-0"
                                        aria-label={
                                            editingSubtask
                                                ? "Update subtask"
                                                : "Add subtask"
                                        }
                                    >
                                        {createSubtaskHook.isPending ||
                                        updateSubtaskHook.isPending ? (
                                            <RiLoaderLine className="size-4 text-muted-foreground animate-spin" />
                                        ) : editingSubtask ? (
                                            <RiCheckLine className="size-4" />
                                        ) : (
                                            <RiAddLine className="size-4" />
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default TaskDetailDrawer;
