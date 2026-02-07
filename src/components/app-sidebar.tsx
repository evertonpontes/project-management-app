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
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "./ui/sidebar";
import { UserButton } from "./user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavMainContent } from "./nav-main";
import { NavProjects } from "./nav-projects";

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
        <NavProjects />
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
