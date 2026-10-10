"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
    RiCalendarLine,
    RiCheckLine,
    RiCloseLine,
    RiEditLine,
    RiLoaderLine,
} from "@remixicon/react";
import { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { useSession } from "@/lib/auth-client";
import { useUpdateTask } from "../hooks";
import type { TaskItem } from "../types";
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "../types";
import { useGetProjectMembers } from "@/features/project/members/hooks";
import { TaskStatusBadge } from "./task-status-badge";
import { TaskPriorityBadge } from "./task-priority-badge";
import { TaskProgressBar } from "./task-progress-bar";

interface TaskDetailDrawerProps {
    task: TaskItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function formatDate(dateInput?: Date | string | null): string {
    if (!dateInput) return "No due date";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "No due date";
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatDateForInput(dateInput?: Date | string | null): string {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
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
    const { data: membersData } = useGetProjectMembers(projectId);
    const members = membersData?.projectMembers || [];

    // Permission check: only the task owner or assigned user can update
    const isTaskOwner = Boolean(currentUserId && task?.createdById === currentUserId);
    const isAssignedUser = Boolean(currentUserId && task?.assignedToId === currentUserId);
    const canEdit = isTaskOwner || isAssignedUser;

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
                  dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
              }
            : undefined,
        () => {
            setIsEditMode(false);
        }
    );

    const isPending = action.isPending;
    const selectedStatus = watch("status") || task?.status || TaskStatus.TODO;
    const selectedPriority = watch("priority") || task?.priority || TaskPriority.MEDIUM;
    const selectedAssignee = watch("assignedToId") || task?.assignedToId || "";

    // Reset drawer form state when task changes or drawer opens
    useEffect(() => {
        if (open && task) {
            reset({
                id: task.id,
                projectId: task.projectId,
                title: task.title,
                description: task.description || "",
                status: task.status,
                priority: task.priority,
                type: task.type,
                assignedToId: task.assignedToId || "",
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
                startDate: task.startDate ? new Date(task.startDate) : undefined,
            });
        }
    }, [open, task, reset]);

    if (!task) return null;

    const handleStatusChange = (value: unknown) => {
        if (typeof value === "string") {
            setValue("status", value as TaskStatus, { shouldValidate: true });
        }
    };

    const handlePriorityChange = (value: unknown) => {
        if (typeof value === "string") {
            setValue("priority", value as TaskPriority, { shouldValidate: true });
        }
    };

    const handleAssigneeChange = (value: unknown) => {
        if (typeof value === "string") {
            setValue("assignedToId", value === "UNASSIGNED" ? null : value, {
                shouldValidate: true,
            });
        }
    };

    const progress = task.progress ?? 0;

    return (
        <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
            <DrawerContent className="w-full sm:max-w-md h-full flex flex-col justify-between border-l border-border bg-card p-0 shadow-2xl">
                {/* Header */}
                <DrawerHeader className="border-b border-border/80 px-6 py-4 flex flex-row items-center justify-between text-left">
                    <div>
                        <DrawerTitle className="text-base font-semibold tracking-tight text-foreground">
                            Task Detail
                        </DrawerTitle>
                        <DrawerDescription className="sr-only">
                            View and edit task details
                        </DrawerDescription>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {!isEditMode ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <Button
                                                variant="outline"
                                                size="icon-sm"
                                                disabled={!canEdit}
                                                onClick={() => setIsEditMode(true)}
                                                className="size-8 rounded-lg border-border/80 cursor-pointer"
                                                aria-label="Edit task"
                                            >
                                                <RiEditLine className="size-4 text-foreground" />
                                            </Button>
                                        }
                                    />
                                    {!canEdit && (
                                        <TooltipContent>
                                            <p className="text-xs">
                                                Only the task creator or assigned user can edit this task
                                            </p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    disabled={isPending}
                                    onClick={() => {
                                        setIsEditMode(false);
                                        reset();
                                    }}
                                    className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                                    aria-label="Cancel editing"
                                >
                                    <RiCloseLine className="size-5" />
                                </Button>
                                <Button
                                    type="submit"
                                    form="update-task-form"
                                    size="icon-sm"
                                    disabled={isPending}
                                    className="size-8 rounded-lg bg-foreground text-background hover:bg-foreground/90"
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
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* View Mode vs Edit Mode Form */}
                    {isEditMode ? (
                        <form
                            id="update-task-form"
                            onSubmit={handleSubmitWithAction}
                            className="space-y-4"
                        >
                            {/* Title */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-foreground">
                                    Title
                                </label>
                                <Input
                                    id="title"
                                    placeholder="Task title"
                                    disabled={isPending}
                                    {...register("title")}
                                />
                                {errors.title?.message && (
                                    <p className="text-xs text-destructive">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-foreground">
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
                                    <p className="text-xs text-destructive">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between py-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Status
                                </span>
                                <div className="w-48">
                                    <Select
                                        value={selectedStatus}
                                        onValueChange={handleStatusChange}
                                        disabled={isPending}
                                    >
                                        <SelectTrigger className="h-8 text-xs w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TASK_STATUS_OPTIONS.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    <span className="flex items-center gap-2">
                                                        <span className={`size-2 rounded-full ${item.color}`} />
                                                        <span>{item.label}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="flex items-center justify-between py-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Priority
                                </span>
                                <div className="w-48">
                                    <Select
                                        value={selectedPriority}
                                        onValueChange={handlePriorityChange}
                                        disabled={isPending}
                                    >
                                        <SelectTrigger className="h-8 text-xs w-full">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TASK_PRIORITY_OPTIONS.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    <span className="flex items-center gap-2">
                                                        <span className={`size-2 rounded-full ${item.color}`} />
                                                        <span>{item.label}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="flex items-center justify-between py-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Due date
                                </span>
                                <div className="w-48">
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        defaultValue={formatDateForInput(task.dueDate)}
                                        className="h-8 text-xs w-full"
                                        disabled={isPending}
                                        {...register("dueDate")}
                                    />
                                </div>
                            </div>

                            {/* Assignee */}
                            <div className="flex items-center justify-between py-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Assignees
                                </span>
                                <div className="w-48">
                                    <Select
                                        value={selectedAssignee || "UNASSIGNED"}
                                        onValueChange={handleAssigneeChange}
                                        disabled={isPending}
                                    >
                                        <SelectTrigger className="h-8 text-xs w-full">
                                            <SelectValue placeholder="Pick a member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UNASSIGNED">
                                                <span className="text-muted-foreground">Unassigned</span>
                                            </SelectItem>
                                            {members.map((member) => (
                                                <SelectItem key={member.user.id} value={member.user.id}>
                                                    <span className="flex items-center gap-2">
                                                        <Avatar className="size-4">
                                                            <AvatarImage src={member.user.image ?? undefined} />
                                                            <AvatarFallback className="text-[8px]">
                                                                {member.user.name?.slice(0, 2).toUpperCase() || "U"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="truncate">{member.user.name}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Progress bar indicator */}
                            <div className="flex items-center justify-between py-1">
                                <span className="text-xs font-medium text-muted-foreground">
                                    Progress
                                </span>
                                <div className="w-48">
                                    <TaskProgressBar progress={progress} className="w-full justify-end" />
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-5">
                            {/* View Mode Title & Description */}
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-bold tracking-tight text-foreground">
                                    {task.title}
                                </h3>
                                {task.description ? (
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {task.description}
                                    </p>
                                ) : (
                                    <p className="text-xs italic text-muted-foreground">
                                        No description provided.
                                    </p>
                                )}
                            </div>

                            {/* View Mode Properties Table */}
                            <div className="space-y-3 pt-1">
                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Status
                                    </span>
                                    <TaskStatusBadge status={task.status} />
                                </div>

                                {/* Priority */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Priority
                                    </span>
                                    <TaskPriorityBadge priority={task.priority} />
                                </div>

                                {/* Due date */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Due date
                                    </span>
                                    <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                                        <RiCalendarLine className="size-3.5 text-muted-foreground" />
                                        <span>{formatDate(task.dueDate)}</span>
                                    </div>
                                </div>

                                {/* Assignee */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Assignees
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {task.assignedTo ? (
                                            <>
                                                <Avatar className="size-5 ring-1 ring-background">
                                                    <AvatarImage src={task.assignedTo.image ?? undefined} />
                                                    <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-medium">
                                                        {task.assignedTo.name?.slice(0, 2).toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs font-medium text-foreground">
                                                    {task.assignedTo.name}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Unassigned</span>
                                        )}
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Progress
                                    </span>
                                    <TaskProgressBar progress={progress} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default TaskDetailDrawer;
