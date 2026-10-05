"use client";

import { useParams } from "next/navigation";
import {
    RiFileChartFill,
    RiFileChartLine,
    RiQuestionFill,
    RiQuestionLine,
    RiSettings3Fill,
    RiSettings3Line,
} from "@remixicon/react";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { NavItemLink, type NavItem } from "./nav-item";

export function NavSupport() {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const baseUrl = `/workspaces/${workspaceId}`;

    const items: NavItem[] = [
        { title: "Settings", url: `${baseUrl}/settings`, iconLine: RiSettings3Line, iconFill: RiSettings3Fill },
        { title: "Reports", url: `${baseUrl}/reports`, iconLine: RiFileChartLine, iconFill: RiFileChartFill },
        { title: "Help Center", url: `${baseUrl}/help`, iconLine: RiQuestionLine, iconFill: RiQuestionFill },
    ];

    return (
        <SidebarGroup>
            <SidebarGroupLabel>SUPPORT</SidebarGroupLabel>
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
