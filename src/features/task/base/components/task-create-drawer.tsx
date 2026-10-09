"use client";

import * as React from "react";
import { useEffect } from "react";
import { RiLoaderLine } from "@remixicon/react";
import { TaskPriority, TaskStatus, TaskTypes } from "@/generated/prisma/enums";

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useCreateTask } from "../hooks";
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "../types";
import { useGetProjectMembers } from "@/features/project/members/hooks";

export interface TaskCreateDrawerProps {
    projectId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialStatus?: TaskStatus;
}

export function TaskCreateDrawer({
    projectId,
    open,
    onOpenChange,
    initialStatus,
}: TaskCreateDrawerProps) {
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
    } = useCreateTask(projectId, () => {
        onOpenChange(false);
    });

    const { data: membersData } = useGetProjectMembers(projectId);
    const members = membersData?.projectMembers || [];

    const isPending = action.isPending;
    const selectedStatus = watch("status") || TaskStatus.TODO;
    const selectedPriority = watch("priority") || TaskPriority.MEDIUM;
    const selectedAssignee = watch("assignedToId") || "";

    useEffect(() => {
        if (open) {
            reset({
                projectId,
                title: "",
                description: "",
                type: TaskTypes.TASK,
                status: initialStatus ?? TaskStatus.TODO,
                priority: TaskPriority.MEDIUM,
                assignedToId: "",
                dueDate: undefined,
                startDate: undefined,
            });
        }
    }, [open, reset, projectId, initialStatus]);

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

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            swipeDirection="right"
        >
            <DrawerContent className="w-full sm:max-w-md h-full flex flex-col justify-between border-l border-border bg-card p-0 shadow-xl">
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <DrawerHeader className="border-b border-border/80 px-6 py-5 text-left">
                        <DrawerTitle className="text-lg font-semibold tracking-tight text-foreground">
                            Add Task
                        </DrawerTitle>
                        <DrawerDescription className="text-sm text-muted-foreground">
                            Create a new task
                        </DrawerDescription>
                    </DrawerHeader>

                    <form
                        id="create-task-form"
                        onSubmit={handleSubmitWithAction}
                        className="flex-1 space-y-5 px-6 py-5"
                    >
                        {/* Status Select */}
                        <Field>
                            <FieldLabel htmlFor="task-status">Status</FieldLabel>
                            <Select
                                value={selectedStatus}
                                onValueChange={handleStatusChange}
                                disabled={isPending}
                            >
                                <SelectTrigger id="task-status" className="w-full">
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
                            {errors.status?.message && (
                                <FieldError>{errors.status.message}</FieldError>
                            )}
                        </Field>

                        {/* Title Input */}
                        <Field>
                            <FieldLabel htmlFor="task-title">Title</FieldLabel>
                            <Input
                                id="task-title"
                                placeholder="What needs to be done?"
                                disabled={isPending}
                                {...register("title")}
                            />
                            {errors.title?.message && (
                                <FieldError>{errors.title.message}</FieldError>
                            )}
                        </Field>

                        {/* Description Textarea */}
                        <Field>
                            <FieldLabel htmlFor="task-description">Description</FieldLabel>
                            <Textarea
                                id="task-description"
                                placeholder="Add more details..."
                                rows={4}
                                disabled={isPending}
                                {...register("description")}
                            />
                            {errors.description?.message && (
                                <FieldError>{errors.description.message}</FieldError>
                            )}
                        </Field>

                        {/* Priority & Due Date in 2 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="task-priority">Priority</FieldLabel>
                                <Select
                                    value={selectedPriority}
                                    onValueChange={handlePriorityChange}
                                    disabled={isPending}
                                >
                                    <SelectTrigger id="task-priority" className="w-full">
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
                                {errors.priority?.message && (
                                    <FieldError>{errors.priority.message}</FieldError>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="task-dueDate">Due date</FieldLabel>
                                <Input
                                    id="task-dueDate"
                                    type="date"
                                    disabled={isPending}
                                    {...register("dueDate")}
                                />
                                {errors.dueDate?.message && (
                                    <FieldError>{errors.dueDate.message}</FieldError>
                                )}
                            </Field>
                        </div>

                        {/* Assignee Select */}
                        <Field>
                            <FieldLabel htmlFor="task-assignee">Assignee</FieldLabel>
                            <Select
                                value={selectedAssignee || "UNASSIGNED"}
                                onValueChange={handleAssigneeChange}
                                disabled={isPending}
                            >
                                <SelectTrigger id="task-assignee" className="w-full">
                                    <SelectValue placeholder="Pick a team member" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UNASSIGNED">
                                        <span className="text-muted-foreground">Unassigned</span>
                                    </SelectItem>
                                    {members.map((member) => (
                                        <SelectItem key={member.user.id} value={member.user.id}>
                                            <span className="flex items-center gap-2">
                                                <Avatar className="size-5">
                                                    <AvatarImage src={member.user.image ?? undefined} />
                                                    <AvatarFallback className="text-[10px]">
                                                        {member.user.name?.slice(0, 2).toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>{member.user.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({member.user.email})
                                                </span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.assignedToId?.message && (
                                <FieldError>{errors.assignedToId.message}</FieldError>
                            )}
                        </Field>
                    </form>
                </div>

                <DrawerFooter className="border-t border-border/80 px-6 py-4 flex flex-row items-center justify-end gap-2 bg-card">
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-task-form"
                        disabled={isPending}
                        className="min-w-24"
                    >
                        {isPending && <RiLoaderLine className="size-4 animate-spin mr-1.5" />}
                        <span>{isPending ? "Adding..." : "Add Task"}</span>
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export default TaskCreateDrawer;
