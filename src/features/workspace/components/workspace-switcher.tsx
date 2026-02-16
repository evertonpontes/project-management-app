"use client";

import { useState } from "react";
import Image from "next/image";
import { Models } from "node-appwrite";

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
import { CaretUpDownIcon, PlusIcon } from "@phosphor-icons/react";

interface WorkspaceSwitcherProps {
  workspaces: Models.RowList<Models.Row & { [key: string]: string }>;
}

const WorkspaceSwitcher = ({ workspaces }: WorkspaceSwitcherProps) => {
  const { isMobile } = useSidebar();
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces?.rows[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <div className="w-full max-w-8">
                    <AspectRatio
                      ratio={1 / 1}
                      className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg"
                    >
                      {activeWorkspace.imageUrl ? (
                        <Image
                          src={activeWorkspace.imageUrl}
                          alt="workspace-logo"
                          fill
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center rounded-lg w-full">
                          {activeWorkspace.name.charAt(0).toLocaleUpperCase()}
                        </span>
                      )}
                    </AspectRatio>
                  </div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeWorkspace.name}
                  </span>
                </div>
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
              {workspaces.rows.map((workspace, index) => (
                <DropdownMenuItem
                  key={workspace.$id}
                  onClick={() => setActiveWorkspace(workspace)}
                  className="gap-2 p-2"
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
                          <span className="flex h-full items-center justify-center rounded-lg w-full">
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
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
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
