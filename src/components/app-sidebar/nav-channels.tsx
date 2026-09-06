"use client";

import { RiAddLine } from "@remixicon/react";
import { useParams } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export function NavChannels() {
  const params = useParams<{ workspaceId: string }>();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        CHANNELS
        <SidebarMenuButton title="Add Channel" className="ml-auto w-auto">
          <RiAddLine />
        </SidebarMenuButton>
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem className="text-muted-foreground flex h-10 items-center px-2 text-xs">
          NO CHANNELS FOUND.
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
