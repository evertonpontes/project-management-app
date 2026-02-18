"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Models } from "node-appwrite";
import { CaretUpDownIcon, PlusIcon } from "@phosphor-icons/react";
import { useParams, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

interface WorkspaceSwitcherProps {
  workspaces: Models.RowList<Models.Row & { [key: string]: string }>;
}

const WorkspaceSwitcher = ({ workspaces }: WorkspaceSwitcherProps) => {
  const { isMobile } = useSidebar();
  const { onOpen } = useCreateWorkspaceModal();
  const router = useRouter();
  const params = useParams<{ workspaceId?: string }>();

  const currentWorkspace = useMemo(() => {
    if (!workspaces?.total) return null;

    const workspace = workspaces.rows.find((w) => w.$id === params.workspaceId);

    return workspace ? workspace : null;
  }, [params, workspaces]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-sidebar-border"
              >
                {currentWorkspace ? (
                  <>
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                      <div className="w-full max-w-8">
                        <AspectRatio
                          ratio={1 / 1}
                          className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg"
                        >
                          {currentWorkspace.imageUrl ? (
                            <Image
                              src={currentWorkspace.imageUrl}
                              alt="workspace-logo"
                              fill
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center rounded-lg w-full">
                              {currentWorkspace.name
                                .charAt(0)
                                .toLocaleUpperCase()}
                            </span>
                          )}
                        </AspectRatio>
                      </div>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {currentWorkspace.name}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="font-semibold truncate">Workspaces</span>
                )}
                <CaretUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Workspaces
              </DropdownMenuLabel>
              {workspaces?.total ? (
                workspaces.rows.map((workspace, index) => (
                  <DropdownMenuItem
                    key={workspace.$id}
                    onClick={() => router.push(`/workspaces/${workspace.$id}`)}
                    className="gap-2 p-2 group"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                      <div className="w-full max-w-8">
                        <AspectRatio
                          ratio={1 / 1}
                          className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg"
                        >
                          {workspace.imageUrl ? (
                            <Image
                              src={workspace.imageUrl}
                              alt="workspace-logo"
                              fill
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center rounded-lg w-full focus:text-primary-foreground group-focus:text-primary-foreground!">
                              {workspace.name.charAt(0).toLocaleUpperCase()}
                            </span>
                          )}
                        </AspectRatio>
                      </div>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {workspace.name}
                      </span>
                    </div>
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="flex p-2 w-full">
                  <span className="text-xs text-muted-foreground mx-auto">
                    No workspaces found.
                  </span>
                </div>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={onOpen}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export { WorkspaceSwitcher };
