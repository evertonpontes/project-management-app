import {
    RiLoader4Line,
    RiUploadCloud2Line,
    RiAlertLine,
    RiUserSharedLine,
    RiDeleteBinLine,
} from "@remixicon/react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceSettingsLoading() {
    return (
        <div className="space-y-8 mx-auto py-8 md:py-10 w-full max-w-2xl">
            {/* Page Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            {/* General Settings Card Skeleton */}
            <Card>
                <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-72 max-w-full" />
                </CardHeader>

                <CardContent className="space-y-6 py-8">
                    {/* Avatar Field Skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex flex-col items-center gap-3 bg-muted/20 p-6 border border-border border-dashed rounded-lg">
                            <div className="flex justify-center items-center bg-muted/40 rounded-full ring-2 ring-muted/50 size-20">
                                <RiUploadCloud2Line className="size-8 text-muted-foreground/40 animate-pulse" />
                            </div>
                            <Skeleton className="rounded-md h-8 w-24" />
                            <div className="flex flex-col items-center space-y-1">
                                <Skeleton className="h-3 w-48" />
                                <Skeleton className="h-2.5 w-36" />
                            </div>
                        </div>
                    </div>

                    {/* Name Field Skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="rounded-md h-9 w-full" />
                    </div>

                    {/* Description Field Skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="rounded-md h-20 w-full" />
                    </div>

                    {/* Key Field Skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="flex-1 rounded-md h-9" />
                            <Skeleton className="rounded-md size-9 shrink-0" />
                            <Skeleton className="rounded-md size-9 shrink-0" />
                        </div>
                        <Skeleton className="h-3 w-56" />
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end pt-4 border-border border-t">
                    <Skeleton className="rounded-md h-9 w-32" />
                </CardFooter>
            </Card>

            {/* Danger Zone Card Skeleton */}
            <Card className="bg-destructive/[0.02] border-destructive/20">
                <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                        <RiAlertLine className="size-5 text-destructive/60 animate-pulse" />
                        <Skeleton className="h-5 w-28" />
                    </div>
                    <Skeleton className="h-4 w-72 max-w-full" />
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Transfer Owner Skeleton */}
                    <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4 bg-amber-500/5 dark:bg-amber-500/10 p-4 border border-amber-500/20 rounded-lg">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <RiUserSharedLine className="size-4 text-amber-500/70" />
                                <Skeleton className="h-4 w-36" />
                            </div>
                            <Skeleton className="h-3 w-64 max-w-full" />
                        </div>
                        <Skeleton className="rounded-md h-9 w-32 shrink-0" />
                    </div>

                    {/* Delete Workspace Skeleton */}
                    <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4 bg-destructive/5 dark:bg-destructive/10 p-4 border border-destructive/20 rounded-lg">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <RiDeleteBinLine className="size-4 text-destructive/70" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-3 w-72 max-w-full" />
                        </div>
                        <Skeleton className="rounded-md h-9 w-36 shrink-0" />
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Spinner Feedback */}
            <div className="flex justify-center items-center gap-2 pt-2 text-muted-foreground">
                <RiLoader4Line className="size-4 animate-spin" />
                <span className="text-xs">Loading workspace settings...</span>
            </div>
        </div>
    );
}

export { WorkspaceSettingsLoading };
