import {
    RiLoader4Line,
    RiTeamLine,
    RiUserAddLine,
    RiSearchLine,
    RiMoreFill,
    RiArrowLeftSLine,
    RiArrowRightSLine,
} from "@remixicon/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function WorkspaceMembersLoading() {
    return (
        <div className="space-y-6 mx-auto px-4 sm:px-6 py-8 md:py-10 w-full">
            {/* Main Panel Card Skeleton */}
            <Card className="shadow-xs border-border">
                {/* Header Skeleton with Title, Description and Invite Button */}
                <CardHeader className="pb-4 border-border/60 border-b">
                    <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <RiTeamLine className="size-5 text-muted-foreground/60 animate-pulse" />
                                <Skeleton className="w-48 sm:w-56 h-7" />
                            </div>
                            <Skeleton className="w-80 max-w-full h-4" />
                        </div>

                        {/* Invite Member Button Skeleton */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Skeleton className="rounded-md w-full sm:w-36 h-9" />
                                <div className="absolute inset-0 flex justify-center items-center gap-1.5 pointer-events-none">
                                    <RiUserAddLine className="size-4 text-muted-foreground/40 animate-pulse" />
                                    <span className="hidden sm:inline font-medium text-muted-foreground/40 text-xs">
                                        Invite member
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-6">
                    {/* Search Toolbar Skeleton */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-full max-w-sm">
                            <RiSearchLine className="top-1/2 left-3 absolute size-4 text-muted-foreground/40 -translate-y-1/2 pointer-events-none" />
                            <Skeleton className="rounded-md w-full h-9" />
                        </div>
                    </div>

                    {/* Table Skeleton Container */}
                    <div className="bg-card border border-border rounded-md overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[45%]">
                                        <Skeleton className="w-16 h-4" />
                                    </TableHead>
                                    <TableHead className="w-[20%]">
                                        <Skeleton className="w-12 h-4" />
                                    </TableHead>
                                    <TableHead className="w-[20%]">
                                        <Skeleton className="w-14 h-4" />
                                    </TableHead>
                                    <TableHead className="w-[15%] text-right">
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={`member-loading-${index}`}>
                                        {/* Member Cell (Avatar, Name, Email) */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="rounded-full size-8 shrink-0" />
                                                <div className="space-y-1.5 min-w-0">
                                                    <Skeleton
                                                        className={`h-4 ${
                                                            index % 2 === 0
                                                                ? "w-28 sm:w-36"
                                                                : "w-24 sm:w-32"
                                                        }`}
                                                    />
                                                    <Skeleton
                                                        className={`h-3 ${
                                                            index % 2 === 0
                                                                ? "w-40 sm:w-48"
                                                                : "w-36 sm:w-44"
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Role Cell */}
                                        <TableCell>
                                            <Skeleton
                                                className={`h-5 rounded-full ${
                                                    index === 0
                                                        ? "w-16"
                                                        : index === 1
                                                          ? "w-24"
                                                          : "w-18"
                                                }`}
                                            />
                                        </TableCell>

                                        {/* Joined Date Cell */}
                                        <TableCell>
                                            <Skeleton className="w-20 sm:w-24 h-4" />
                                        </TableCell>

                                        {/* Action Dropdown Menu Trigger Skeleton */}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end">
                                                <div className="relative flex justify-center items-center rounded-md size-8">
                                                    <Skeleton className="rounded-md size-8" />
                                                    <RiMoreFill className="absolute inset-0 m-auto size-4 text-muted-foreground/40 pointer-events-none" />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Skeleton */}
                    <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 py-4">
                        <Skeleton className="w-44 h-4" />

                        <div className="flex items-center gap-3">
                            <Skeleton className="hidden sm:block w-20 h-4" />

                            <div className="flex items-center gap-1.5">
                                <div className="relative">
                                    <Skeleton className="rounded-md w-20 h-8" />
                                    <div className="absolute inset-0 flex justify-center items-center gap-1 text-muted-foreground/40 pointer-events-none">
                                        <RiArrowLeftSLine className="size-4" />
                                        <span className="text-xs">Prev</span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Skeleton className="rounded-md w-20 h-8" />
                                    <div className="absolute inset-0 flex justify-center items-center gap-1 text-muted-foreground/40 pointer-events-none">
                                        <span className="text-xs">Next</span>
                                        <RiArrowRightSLine className="size-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Status Feedback */}
            <div className="flex justify-center items-center gap-2 pt-2 text-muted-foreground">
                <RiLoader4Line className="size-4 animate-spin" />
                <span className="text-xs">Loading workspace members...</span>
            </div>
        </div>
    );
}

export {
    WorkspaceMembersLoading,
    WorkspaceMembersLoading as WorkspaceSettingsLoading,
};
