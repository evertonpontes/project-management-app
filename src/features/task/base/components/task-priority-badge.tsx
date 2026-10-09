import * as React from "react";
import { TaskPriority } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

interface TaskPriorityBadgeProps {
    priority: TaskPriority | string;
    showBadge?: boolean;
    className?: string;
}

const priorityConfig: Record<string, { label: string; dotColor: string }> = {
    [TaskPriority.LOW]: {
        label: "Low",
        dotColor: "bg-blue-500",
    },
    [TaskPriority.MEDIUM]: {
        label: "Medium",
        dotColor: "bg-amber-500",
    },
    [TaskPriority.HIGH]: {
        label: "High",
        dotColor: "bg-rose-500",
    },
    [TaskPriority.CRITICAL]: {
        label: "Critical",
        dotColor: "bg-purple-600",
    },
};

export function TaskPriorityBadge({
    priority,
    showBadge = true,
    className,
}: TaskPriorityBadgeProps) {
    const config = priorityConfig[priority] || {
        label: priority,
        dotColor: "bg-slate-400",
    };

    if (!showBadge) {
        return (
            <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-foreground", className)}>
                <span className={cn("size-2 rounded-full", config.dotColor)} />
                <span>{config.label}</span>
            </span>
        );
    }

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/50 px-2 py-0.5 text-xs font-medium text-foreground shadow-2xs",
                className
            )}
        >
            <span className={cn("size-1.5 rounded-full shrink-0", config.dotColor)} />
            <span>{config.label}</span>
        </span>
    );
}
