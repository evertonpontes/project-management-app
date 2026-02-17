"use client";

import {
  ChartBarIcon,
  GaugeIcon,
  GearIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/features/workspace/components/workspace-switcher";
import { useGetWorkspaces } from "@/features/workspace/hooks/use-get-workspaces";
import { UserButton } from "./user-button";
import { NavMain } from "./nav-main";

const navMain = [
  {
    title: "Overview",
    url: "/",
    icon: GaugeIcon,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartBarIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: GearIcon,
  },
  {
    title: "Teams",
    url: "/teams",
    icon: UsersThreeIcon,
  },
];

const AppSidebar = () => {
  const { data: workspaces, isLoading } = useGetWorkspaces();

  if (isLoading) return null;

  return (
    <Sidebar>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={workspaces?.data!} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain options={navMain} />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export { AppSidebar };
