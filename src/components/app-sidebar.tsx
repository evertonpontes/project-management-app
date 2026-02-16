"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/features/workspace/components/workspace-switcher";
import { useGetWorkspaces } from "@/features/workspace/hooks/use-get-workspaces";

const AppSidebar = () => {
  const { data: workspaces, isLoading } = useGetWorkspaces();

  if (isLoading) return null;

  return (
    <Sidebar>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={workspaces?.data!} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export { AppSidebar };
