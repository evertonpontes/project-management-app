import * as React from "react";
import { cn } from "@/lib/utils";

interface TaskProgressBarProps {
    progress?: number;
    showText?: boolean;
    className?: string;
}

export function TaskProgressBar({
    progress = 0,
    showText = true,
    className,
}: TaskProgressBarProps) {
    const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="relative h-1.5 w-16 min-w-16 rounded-full bg-muted overflow-hidden">
                <div
                    className="h-full rounded-full bg-foreground transition-all duration-300"
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
            {showText && (
                <span className="text-xs text-muted-foreground w-8 text-right font-medium">
                    {clampedProgress}%
                </span>
            )}
        </div>
    );
}
