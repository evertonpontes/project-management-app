import { RiLoader4Line } from "@remixicon/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspacesLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header skeleton */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-9 w-36 rounded-md" />
                </div>

                {/* Workspace cards skeleton */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-lg border border-border bg-card p-5 space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-5/6" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Centered spinner */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <RiLoader4Line className="size-5 animate-spin" />
                    <span className="text-sm">Loading workspaces...</span>
                </div>
            </div>
        </div>
    );
}
