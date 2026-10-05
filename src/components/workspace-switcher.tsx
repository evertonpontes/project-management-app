"use client";

import { useParams, useRouter } from "next/navigation";
import {
    RiAddLine,
    RiBuilding4Line,
    RiCheckLine,
    RiExpandUpDownLine,
    RiMoreLine,
} from "@remixicon/react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useGetWorkspaces, useGetWorkspaceById } from "@/features/workspace";

function getInitials(name?: string | null): string {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function WorkspaceSwitcher() {
    const router = useRouter();
    const { isMobile } = useSidebar();
    const params = useParams<{ workspaceId: string }>();
    const workspaceId = params.workspaceId;

    const { data: workspacesData, isLoading: isLoadingWorkspaces } = useGetWorkspaces({
        page: 1,
        rowSize: 10,
    });
    const { data: currentWorkspaceData, isLoading: isLoadingCurrent } = useGetWorkspaceById(workspaceId);

    const workspaces = workspacesData?.workspaces ?? [];
    const total = workspacesData?.pagination?.total ?? workspaces.length;
    const hasMoreThanTen = total > 10;
    const displayedWorkspaces = workspaces.slice(0, 10);

    const activeWorkspace = workspaces.find((w) => w.id === workspaceId) ?? currentWorkspaceData;
    const isLoading = (isLoadingWorkspaces && workspaces.length === 0) || (Boolean(workspaceId) && isLoadingCurrent && !activeWorkspace);

    const handleSelectWorkspace = (id: string) => {
        router.push(`/workspaces/${id}`);
    };

    const handleCreateWorkspace = () => {
        router.push("/workspaces/create");
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <SidebarMenuButton
                        size="lg"
                        className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                        aria-label="Select workspace"
                    />
                }
            >
                {isLoading ? (
                    <>
                        <div className="flex justify-center items-center bg-muted rounded-md size-8 text-muted-foreground shrink-0">
                            <RiBuilding4Line className="size-4 animate-pulse" />
                        </div>
                        <span className="flex-1 text-muted-foreground text-xs truncate">Loading...</span>
                    </>
                ) : activeWorkspace ? (
                    <>
                        {activeWorkspace.avatarUrl ? (
                            <Avatar className="rounded-md size-8 shrink-0">
                                <AvatarImage src={activeWorkspace.avatarUrl} alt={activeWorkspace.name} />
                                <AvatarFallback className="rounded-md font-semibold text-xs">
                                    {getInitials(activeWorkspace.name)}
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <div className="flex justify-center items-center bg-primary/10 rounded-md size-8 text-primary shrink-0">
                                <RiBuilding4Line className="size-4" />
                            </div>
                        )}
                        <span className="flex-1 font-medium truncate">{activeWorkspace.name}</span>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center items-center bg-muted rounded-md size-8 text-muted-foreground shrink-0">
                            <RiBuilding4Line className="size-4" />
                        </div>
                        <span className="flex-1 text-muted-foreground truncate">Select a workspace</span>
                    </>
                )}
                <RiExpandUpDownLine className="ml-auto size-4 text-muted-foreground shrink-0" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={6}
                className="min-w-64"
            >

                <DropdownMenuGroup>
                    <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {displayedWorkspaces.length === 0 && !isLoadingWorkspaces && (
                        <div className="px-2 py-3 text-muted-foreground text-xs text-center">
                            No workspaces found
                        </div>
                    )}

                    {displayedWorkspaces.map((workspace) => {
                        const isActive = workspace.id === activeWorkspace?.id;

                        return (
                            <DropdownMenuItem
                                key={workspace.id}
                                onClick={() => handleSelectWorkspace(workspace.id)}
                                className="cursor-pointer"
                            >
                                {workspace.avatarUrl ? (
                                    <Avatar className="rounded-md size-6 shrink-0">
                                        <AvatarImage src={workspace.avatarUrl} alt={workspace.name} />
                                        <AvatarFallback className="rounded-md font-semibold text-[10px]">
                                            {getInitials(workspace.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <div className="flex justify-center items-center bg-muted rounded-md size-6 text-muted-foreground shrink-0">
                                        <RiBuilding4Line className="size-3.5" />
                                    </div>
                                )}
                                <span className="flex-1 truncate">{workspace.name}</span>
                                {isActive && (
                                    <RiCheckLine className="ml-auto size-4 text-primary shrink-0" />
                                )}
                            </DropdownMenuItem>
                        );
                    })}

                    {hasMoreThanTen && (
                        <DropdownMenuItem
                            className="justify-center text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                            onClick={(e) => {
                                // Informational option - functionality not implemented as requested
                                e.preventDefault();
                            }}
                        >
                            <RiMoreLine className="size-3.5" />
                            <span>More workspaces ({total - 10}+)</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleCreateWorkspace} className="cursor-pointer">
                    <div className="flex justify-center items-center border border-muted-foreground/40 border-dashed rounded-md size-6 shrink-0">
                        <RiAddLine className="size-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium truncate">Create workspace</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
