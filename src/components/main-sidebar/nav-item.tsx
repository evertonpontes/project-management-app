"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RemixiconComponentType } from "@remixicon/react";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export type NavItem = {
    title: string;
    url: string;
    iconLine: RemixiconComponentType;
    iconFill: RemixiconComponentType;
    /** When true, the item is only active on an exact URL match. */
    exact?: boolean;
};

function isPathActive(pathname: string, url: string, exact?: boolean) {
    if (exact) return pathname === url;
    return pathname === url || pathname.startsWith(`${url}/`);
}

export function NavItemLink({ item }: { item: NavItem }) {
    const pathname = usePathname();
    const isActive = isPathActive(pathname, item.url, item.exact);
    const Icon = isActive ? item.iconFill : item.iconLine;

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                isActive={isActive}
                tooltip={item.title}
                render={<Link href={item.url} />}
            >
                <Icon />
                <span>{item.title}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
