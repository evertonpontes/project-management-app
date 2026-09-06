"use client";

import { useParams } from "next/navigation";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useGetWorkspaces } from "@/features/workspace";

export function WorkspaceSwitcher() {
  const params = useParams<{ workspaceId: string }>();

  const { data: workspaces, isLoading } = useGetWorkspaces();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton />}>
            Select Workspace
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
