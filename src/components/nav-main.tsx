"use client";

import { Icon } from "@phosphor-icons/react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
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
  const { state } = useSidebar();
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
                <SidebarMenuButton
                  render={
                    <Link
                      href={fullPath}
                      className={cn(
                        "flex items-center text-sidebar-foreground/85 gap-2",
                        state === "collapsed" && "justify-center",
                      )}
                    />
                  }
                >
                  <Icon
                    weight={isActive ? "bold" : "regular"}
                    className="size-5!"
                  />
                  <span
                    className={cn(
                      "font-normal",
                      isActive && "font-semibold",
                      state === "collapsed" && "hidden",
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
