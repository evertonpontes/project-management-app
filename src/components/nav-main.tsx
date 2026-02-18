"use client";

import { Icon } from "@phosphor-icons/react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavMainProps {
  options: {
    title: string;
    url: string;
    icon: Icon;
  }[];
}

const NavMain = ({ options }: NavMainProps) => {
  const params = useParams<{ workspaceId?: string }>();

  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {options.map((option) => {
            const fullPath = `/workspaces/${params.workspaceId}${option.url}`;

            const Icon = option.icon;

            const isActive = fullPath === pathname;

            return (
              <SidebarMenuItem key={option.title}>
                <SidebarMenuButton render={<Link href={fullPath} />}>
                  <Icon />
                  <span
                    className={cn(
                      "text-sidebar-foreground font-normal",
                      isActive && "font-semibold",
                    )}
                  >
                    {option.title}
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

export { NavMain };
