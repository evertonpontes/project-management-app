"use client";

import {
  RiDashboardLine,
  RiGroupLine,
  RiListCheck3,
  RiSettings4Line,
} from "@remixicon/react";
import { useParams } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export function NavMain() {
  const params = useParams<{ workspaceId: string }>();

  const navMainItems = [
    {
      name: "Dashboard",
      href: `/workspaces/${params.workspaceId}`,
      icon: RiDashboardLine,
    },
    {
      name: "My Tasks",
      href: `/workspaces/${params.workspaceId}/tasks`,
      icon: RiListCheck3,
    },
    {
      name: "Members",
      href: `/workspaces/${params.workspaceId}/members`,
      icon: RiGroupLine,
    },
    {
      name: `Settings`,
      href: `/workspaces/${params.workspaceId}/settings`,
      icon: RiSettings4Line,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navMainItems.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton render={<a href={item.href} />}>
              <item.icon className="size-5" />
              {item.name}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
