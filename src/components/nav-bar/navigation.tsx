"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWorkspaceById, useGetWorkspaces } from "@/features/workspace";
import { cn } from "cn";

const routeNames: Record<string, string> = {
    analytics: "Analytics",
    tasks: "My Task",
    inbox: "Inbox",
    projects: "Projects",
    members: "Members",
    settings: "Settings",
    reports: "Reports",
    help: "Help Center",
};

interface NavigationProps {
    className?: string;
}

export function Navigation({ className }: NavigationProps) {
    const params = useParams<{ workspaceId: string }>();
    const pathname = usePathname();
    const workspaceId = params?.workspaceId;

    const { data: workspacesData, isLoading: isLoadingWorkspaces } = useGetWorkspaces({
        page: 1,
        rowSize: 10,
    });
    const { data: currentWorkspaceData, isLoading: isLoadingCurrent } = useGetWorkspaceById(workspaceId);

    const workspaces = workspacesData?.workspaces ?? [];
    const activeWorkspace = workspaces.find((w) => w.id === workspaceId) ?? currentWorkspaceData;
    const isLoading =
        (isLoadingWorkspaces && workspaces.length === 0) ||
        (Boolean(workspaceId) && isLoadingCurrent && !activeWorkspace);

    const baseUrl = `/workspaces/${workspaceId}`;
    let subRouteTitle: string | null = null;

    if (pathname && workspaceId && pathname.startsWith(baseUrl)) {
        const subPath = pathname.slice(baseUrl.length).replace(/^\/+/, "");
        if (subPath) {
            const firstSegment = subPath.split("/")[0];
            subRouteTitle =
                routeNames[firstSegment] ??
                (firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1).replace(/-/g, " "));
        }
    }

    const workspaceName = activeWorkspace?.name;

    return (
        <Breadcrumb className={cn(className)}>
            <BreadcrumbList>
                <BreadcrumbItem>
                    {isLoading ? (
                        <Skeleton className="h-4 w-24" />
                    ) : subRouteTitle ? (
                        <BreadcrumbLink render={<Link href={baseUrl} />}>
                            {workspaceName ?? "Workspace"}
                        </BreadcrumbLink>
                    ) : (
                        <BreadcrumbPage>{workspaceName ?? "Workspace"}</BreadcrumbPage>
                    )}
                </BreadcrumbItem>
                {subRouteTitle && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{subRouteTitle}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
