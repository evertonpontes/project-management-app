"use client";

import Image from "next/image";
import { BellIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Separator } from "./ui/separator";
import { UserButton } from "./user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Button } from "./ui/button";
import { useParams, usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { useGetWorkspace } from "@/features/workspace/hooks/use-get-workspace";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
  const params = useParams<{ workspaceId: string }>();
  const pathname = usePathname();
  const { data: workspace } = useGetWorkspace({
    workspaceId: params.workspaceId,
  });

  const routes = pathname
    .split("/")
    .filter(Boolean)
    .map((route) => ({
      name: route === params.workspaceId ? workspace?.data.name : route,
      href: `${pathname.split(route)[0]}${route}`,
    }));

  return (
    <header className="flex h-full max-h-14 bg-background sticky top-0 w-full items-center px-4 py-2">
      <nav className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="w-24 h-8 overflow-hidden relative hidden md:block">
            <Image
              src="/light-logo.svg"
              alt="logo"
              fill
              className="absolute object-contain hidden dark:block"
            />
            <Image
              src="/dark-logo.svg"
              alt="logo"
              fill
              className="absolute object-contain dark:hidden"
            />
          </div>
          <SidebarTrigger className="md:hidden" />
          <Separator orientation="vertical" className="mx-2" />
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {routes.map((route, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={route.href}
                      className={cn(route.href === pathname && "hidden")}
                    >
                      {route.name}
                    </BreadcrumbLink>
                    <BreadcrumbPage
                      className={cn(route.href !== pathname && "hidden")}
                    >
                      {route.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                  {index < routes.length - 1 && <BreadcrumbSeparator />}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <MagnifyingGlassIcon weight="bold" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Badge className="p-0 absolute size-2 top-0 right-0 bg-indigo-500" />
            <BellIcon weight="bold" />
          </Button>
        </div>
      </nav>
    </header>
  );
};

export { Header };
