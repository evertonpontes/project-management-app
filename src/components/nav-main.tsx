import { Icon } from "@phosphor-icons/react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";

interface NavMainProps {
  options: {
    title: string;
    url: string;
    icon: Icon;
  }[];
}

const NavMain = ({ options }: NavMainProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {options.map((option) => (
            <SidebarMenuItem key={option.title}>
              <SidebarMenuButton tooltip={option.title}>
                <Button
                  variant="ghost"
                  nativeButton={false}
                  className="p-0 font-normal"
                  render={
                    <Link href={option.url}>
                      <option.icon />
                      <span>{option.title}</span>
                    </Link>
                  }
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export { NavMain };
