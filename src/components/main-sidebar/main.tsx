"use client";

import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { MainNav } from "./main-nav";
import { NavProjects } from "./nav-projects";
import { NavSupport } from "./nav-support";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <WorkspaceSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <MainNav />
                <NavProjects />
                <NavSupport />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
