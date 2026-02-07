"use client";

import { Icon } from "@phosphor-icons/react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavMainContentProps {
  options: { name: string; href: string; icon: Icon }[];
}

const NavMainContent = ({ options }: NavMainContentProps) => {
  const params = useParams<{ workspaceId: string }>();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {options.map((option) => {
            const fullPath = `/workspace/${params.workspaceId}${option.href}`;
            const Icon = option.icon;
            const isActive = fullPath === window.location.pathname;

            return (
              <SidebarMenuItem key={option.href}>
                <SidebarMenuButton render={<Link href={fullPath} />}>
                  <Icon />
                  <span className={cn(isActive && "font-semibold")}>
                    {option.name}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export { NavMainContent };
