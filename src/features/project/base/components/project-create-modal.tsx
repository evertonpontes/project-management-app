"use client";

import { useEffect } from "react";
import { RiFolderAddLine, RiLoaderLine } from "@remixicon/react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateProject } from "../hooks";

export interface ProjectCreateModalProps {
    workspaceId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProjectCreateModal({
    workspaceId,
    open,
    onOpenChange,
}: ProjectCreateModalProps) {
    const {
        form: {
            register,
            reset,
            formState: { errors },
        },
        handleSubmitWithAction,
        action,
    } = useCreateProject(workspaceId, () => {
        onOpenChange(false);
    });

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const isPending = action.isPending;

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title={
                <span className="flex items-center gap-2">
                    <RiFolderAddLine className="size-5 text-primary" />
                    <span>Create project</span>
                </span>
            }
            description="Add a new project to this workspace to organize tasks, deadlines, and collaborate with your team."
            dialogClassName="sm:max-w-md"
        >
            <form onSubmit={handleSubmitWithAction} className="space-y-4 py-2">
                <Field>
                    <FieldLabel htmlFor="project-name">Project name</FieldLabel>
                    <Input
                        id="project-name"
                        type="text"
                        placeholder="e.g. Website Redesign"
                        disabled={isPending}
                        {...register("name")}
                    />
                    {errors.name?.message && (
                        <FieldError>{errors.name.message}</FieldError>
                    )}
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="project-start-date">
                            Start date
                        </FieldLabel>
                        <Input
                            id="project-start-date"
                            type="date"
                            disabled={isPending}
                            {...register("startDate")}
                        />
                        {errors.startDate?.message && (
                            <FieldError>{errors.startDate.message}</FieldError>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="project-due-date">
                            Due date
                        </FieldLabel>
                        <Input
                            id="project-due-date"
                            type="date"
                            disabled={isPending}
                            {...register("dueDate")}
                        />
                        {errors.dueDate?.message && (
                            <FieldError>{errors.dueDate.message}</FieldError>
                        )}
                    </Field>
                </div>

                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                    <Button
                        variant="outline"
                        type="button"
                        disabled={isPending}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && (
                            <RiLoaderLine className="size-4 animate-spin" />
                        )}
                        <span>{isPending ? "Creating..." : "Create project"}</span>
                    </Button>
                </div>
            </form>
        </ResponsiveModal>
    );
}
