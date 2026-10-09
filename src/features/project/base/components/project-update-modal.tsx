"use client";

import { useEffect } from "react";
import { RiEditLine, RiLoaderLine } from "@remixicon/react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUpdateProject } from "../hooks";
import type { ProjectItem } from "../types";

export interface ProjectUpdateModalProps {
    project: ProjectItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function formatDateForInput(dateValue?: Date | string | null): string {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
}

export function ProjectUpdateModal({
    project,
    open,
    onOpenChange,
}: ProjectUpdateModalProps) {
    const {
        form: {
            register,
            reset,
            formState: { errors },
        },
        handleSubmitWithAction,
        action,
    } = useUpdateProject(
        {
            id: project?.id,
            workspaceId: project?.workspaceId,
            name: project?.name,
            startDate: project?.startDate ? new Date(project.startDate) : undefined,
            dueDate: project?.dueDate ? new Date(project.dueDate) : undefined,
        },
        () => {
            onOpenChange(false);
        }
    );

    useEffect(() => {
        if (project && open) {
            reset({
                id: project.id,
                workspaceId: project.workspaceId,
                name: project.name,
                startDate: formatDateForInput(project.startDate) as unknown as Date,
                dueDate: formatDateForInput(project.dueDate) as unknown as Date,
            });
        }
    }, [project, open, reset]);

    const isPending = action.isPending;

    return (
        <ResponsiveModal
            open={open}
            onOpenChange={onOpenChange}
            title={
                <span className="flex items-center gap-2">
                    <RiEditLine className="size-5 text-primary" />
                    <span>Edit project</span>
                </span>
            }
            description="Update the project details, start date, and due date for your team."
            dialogClassName="sm:max-w-md"
        >
            <form onSubmit={handleSubmitWithAction} className="space-y-4 py-2">
                <input type="hidden" {...register("id")} />
                {project?.workspaceId && (
                    <input type="hidden" {...register("workspaceId")} />
                )}

                <Field>
                    <FieldLabel htmlFor="edit-project-name">
                        Project name
                    </FieldLabel>
                    <Input
                        id="edit-project-name"
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
                        <FieldLabel htmlFor="edit-project-start-date">
                            Start date
                        </FieldLabel>
                        <Input
                            id="edit-project-start-date"
                            type="date"
                            disabled={isPending}
                            {...register("startDate")}
                        />
                        {errors.startDate?.message && (
                            <FieldError>{errors.startDate.message}</FieldError>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="edit-project-due-date">
                            Due date
                        </FieldLabel>
                        <Input
                            id="edit-project-due-date"
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
                        <span>{isPending ? "Saving..." : "Save changes"}</span>
                    </Button>
                </div>
            </form>
        </ResponsiveModal>
    );
}
