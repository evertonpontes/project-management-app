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
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/features/workspace/components/workspace-switcher";
import { useGetWorkspaces } from "@/features/workspace/api/use-get-workspaces";
import { useCurrent } from "@/features/auth/api/use-current";
import { NavMain } from "./nav-main";

const navMain = [
  {
    title: "Overview",
    url: "",
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
    title: "Members",
    url: "/members",
    icon: UsersThreeIcon,
  },
];

const AppSidebar = () => {
  const { data: workspaces } = useGetWorkspaces();

  const { data: user, isLoading: isLoadingCurrent } = useCurrent();

  if (!isLoadingCurrent && !user?.data) return null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={workspaces?.data!} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain options={navMain} />
        <SidebarGroup />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export { AppSidebar };
