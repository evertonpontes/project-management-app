"use client";

import { useParams } from "next/navigation";
import {
    RiBarChartBoxFill,
    RiBarChartBoxLine,
    RiDashboardFill,
    RiDashboardLine,
    RiFolderFill,
    RiFolderLine,
    RiInboxFill,
    RiInboxLine,
    RiTaskFill,
    RiTaskLine,
    RiGroupFill,
    RiGroupLine,
} from "@remixicon/react";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { NavItemLink, type NavItem } from "./nav-item";

export function MainNav() {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const baseUrl = `/workspaces/${workspaceId}`;

    const items: NavItem[] = [
        { title: "Dashboard", url: baseUrl, iconLine: RiDashboardLine, iconFill: RiDashboardFill, exact: true },
        { title: "Members", url: `${baseUrl}/members`, iconLine: RiGroupLine, iconFill: RiGroupFill },
        { title: "Analytics", url: `${baseUrl}/analytics`, iconLine: RiBarChartBoxLine, iconFill: RiBarChartBoxFill },
        { title: "My Task", url: `${baseUrl}/tasks`, iconLine: RiTaskLine, iconFill: RiTaskFill },
        { title: "Inbox", url: `${baseUrl}/inbox`, iconLine: RiInboxLine, iconFill: RiInboxFill },
        { title: "Projects", url: `${baseUrl}/projects`, iconLine: RiFolderLine, iconFill: RiFolderFill },
    ];

    return (
        <SidebarGroup>
            <SidebarGroupLabel>GENERAL</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <NavItemLink key={item.title} item={item} />
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
