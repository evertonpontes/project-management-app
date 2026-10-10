import * as React from "react";
import { TaskStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

interface TaskStatusBadgeProps {
    status: TaskStatus | string;
    className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    [TaskStatus.TODO]: {
        label: "Todo",
        className: "bg-muted text-muted-foreground border-border",
    },
    [TaskStatus.IN_PROGRESS]: {
        label: "In Progress",
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    [TaskStatus.IN_REVIEW]: {
        label: "In Review",
        className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    [TaskStatus.DONE]: {
        label: "Done",
        className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
};

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
    const config = statusConfig[status] || {
        label: status,
        className: "bg-muted text-muted-foreground border-border",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                config.className,
                className
            )}
        >
            {config.label}
        </span>
    );
}
