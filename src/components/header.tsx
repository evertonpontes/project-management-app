"use client";

import Image from "next/image";
import { redirect, useParams, usePathname } from "next/navigation";
import { BellIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Badge } from "./ui/badge";
import { SidebarTrigger } from "./ui/sidebar";

import { capitalize } from "@/lib/utils";
import { useGetWorkspaces } from "@/features/workspace/hooks/use-get-workspaces";

const Header = () => {
  const params = useParams<{ workspaceId?: string }>();
  const pathname = usePathname();
  const { data: workspaces } = useGetWorkspaces();

  const workspace = workspaces?.data.rows.find(
    (w) => w.$id === params.workspaceId,
  );

  // generate routes
  const routes = pathname
    .split("/")
    .filter(Boolean)
    .map((route) => {
      if (!workspace)
        return {
          name: capitalize(route),
          href: `${pathname.split(route)[0]}${route}`,
        };

      return {
        name:
          route === params.workspaceId
            ? capitalize(workspace?.name)
            : capitalize(route),
        href: `${pathname.split(route)[0]}${route}`,
      };
    });

  if (params.workspaceId && !workspace) return redirect("/workspace");

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
              loading="eager"
            />
            <Image
              src="/dark-logo.svg"
              alt="logo"
              fill
              className="absolute object-contain dark:hidden"
              loading="eager"
            />
          </div>
          <SidebarTrigger className="md:hidden" />
          <Separator orientation="vertical" className="mx-2 hidden sm:block" />
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {routes.map((route, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <BreadcrumbItem>
                    {route.href === pathname ? (
                      <BreadcrumbPage>{route.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={route.href}>
                        {route.name}
                      </BreadcrumbLink>
                    )}
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
