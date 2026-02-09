"use client";

import {
  ChartBarIcon,
  ChartLineIcon,
  GearIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "./ui/sidebar";
import { UserButton } from "./user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavMainContent } from "./nav-main";
import { redirect, useParams } from "next/navigation";
import { useGetWorkspaces } from "@/features/workspace/hooks/use-get-workspaces";

const navMain = [
  {
    name: "Overview",
    href: "",
    icon: ChartBarIcon,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: ChartLineIcon,
  },
  {
    name: "Members",
    href: "/members",
    icon: UsersThreeIcon,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: GearIcon,
  },
];

const AppSidebar = () => {
  const params = useParams<{ workspaceId?: string }>();

  const { data: workspaces } = useGetWorkspaces();

  const workspace = workspaces?.data.rows.find(
    (w) => w.$id === params.workspaceId,
  );

  if (params.workspaceId && !workspace) return redirect("/workspace");

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <WorkspaceSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent>
        <NavMainContent options={navMain} />
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
