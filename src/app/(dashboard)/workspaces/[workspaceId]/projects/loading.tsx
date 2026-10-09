import {
    RiCalendarLine,
    RiFolder3Line,
    RiFolderLine,
    RiGroupLine,
    RiTaskLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
} from "@remixicon/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function WorkspaceProjectsLoading() {
    return (
        <div
            className="flex flex-col flex-1 w-full p-6 md:p-8 space-y-6"
            data-slot="projects-loading"
        >
            {/* Header simulation */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary/50">
                            <RiFolderLine className="size-5" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-7 w-28" />
                            <Skeleton className="h-5 w-8 rounded-full" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-64 sm:w-80" />
                </div>

                <Skeleton className="h-9 w-32 rounded-lg self-start sm:self-auto" />
            </div>

            {/* Grid simulation */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card
                        key={index}
                        className="overflow-hidden border-border bg-card shadow-xs"
                    >
                        <Skeleton className="h-1 w-full rounded-none" />
                        <CardHeader className="pt-5 pb-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0 w-full">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-muted-foreground/40">
                                        <RiFolder3Line className="size-5" />
                                    </div>
                                    <div className="space-y-1.5 w-full min-w-0">
                                        <Skeleton className="h-4 w-3/4" />
                                        <div className="flex items-center gap-1 text-muted-foreground/30">
                                            <RiCalendarLine className="size-3" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2 pb-5">
                            <div className="flex items-center justify-between border-t border-border/50 pt-3">
                                <div className="flex items-center gap-3 text-muted-foreground/30">
                                    <div className="flex items-center gap-1">
                                        <RiTaskLine className="size-3.5" />
                                        <Skeleton className="h-3.5 w-12" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <RiGroupLine className="size-3.5" />
                                        <Skeleton className="h-3.5 w-14" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Skeleton className="size-5 rounded-full" />
                                    <Skeleton className="h-3.5 w-12" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination simulation */}
            <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between border-t border-border/40 pt-4">
                <Skeleton className="h-4 w-44" />
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Skeleton className="h-4 w-24 mr-2" />
                    <div className="flex items-center gap-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-muted/30 text-muted-foreground/40">
                            <RiArrowLeftSLine className="size-4" />
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-muted/30 text-muted-foreground/40">
                            <RiArrowRightSLine className="size-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
