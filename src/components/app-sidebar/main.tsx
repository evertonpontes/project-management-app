import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { NavChannels } from "./nav-channels";
import { NavMain } from "./nav-main";
import { NavProject } from "./nav-projects";
import { WorkspaceSwitcher } from "./workspace-switcher";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProject />
        <NavChannels />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
