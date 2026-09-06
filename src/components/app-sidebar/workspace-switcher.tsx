"use client";

import { useParams, useRouter } from "next/navigation";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useGetWorkspaces } from "@/features/workspace";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";
import { RiAddLine, RiExpandUpDownLine } from "@remixicon/react";

export function WorkspaceSwitcher() {
  const params = useParams<{ workspaceId: string }>();

  const router = useRouter();

  const { data: workspaces, isLoading } = useGetWorkspaces();

  const currentWorkspace = useMemo(() => {
    if (!isLoading) {
      if (workspaces && workspaces.length > 0) {
        return workspaces.find(
          (workspace) => workspace.id === params.workspaceId,
        );
      }
      return null;
    }

    return null;
  }, [isLoading, params.workspaceId, workspaces]);

  if (isLoading) {
    return <Skeleton className="h-8 w-full" />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton />}>
            {currentWorkspace ? (
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground relative flex size-6 items-center justify-center overflow-hidden rounded-md">
                  <span className="text-center text-xs font-medium">
                    {currentWorkspace.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {currentWorkspace.name}
                </span>
              </div>
            ) : (
              <div>Select a workspace</div>
            )}
            <RiExpandUpDownLine className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              {workspaces ? (
                workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => router.push(`/workspaces/${workspace.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-primary text-primary-foreground relative flex size-6 items-center justify-center overflow-hidden rounded-md">
                        <span className="text-center text-xs font-medium">
                          {workspace.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {workspace.name}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      No workspaces found
                    </span>
                  </div>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/workspaces/create")}>
              <div className="border-border flex size-6 items-center justify-center rounded-md border">
                <RiAddLine />
              </div>
              Create workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
