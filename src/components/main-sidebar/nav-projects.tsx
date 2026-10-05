"use client";

import { RiAddLine } from "@remixicon/react";

import {
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function NavProjects() {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>RECENT PROJECTS</SidebarGroupLabel>
            {/* Not functional yet - projects logic is not implemented */}
            <SidebarGroupAction title="Add project" aria-label="Add project">
                <RiAddLine />
            </SidebarGroupAction>
            <SidebarGroupContent>
                <p className="px-2 py-1.5 text-muted-foreground text-xs">No projects yet.</p>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
