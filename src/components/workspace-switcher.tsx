"use client";

import React from "react";

import { CaretDownIcon, PlusIcon } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandSeparator,
  CommandItem,
} from "./ui/command";
import { useListWorkspaces } from "@/features/workspace/hooks/use-list-workspaces";
import { usePathname, useRouter } from "next/navigation";
import { useGetWorkspace } from "@/features/workspace/hooks/use-get-workspace";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

const WorkspaceSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const workspaceId = pathname.split("/")[2];

  const { data: workspaces, isLoading: isLoadingWorkspaces } =
    useListWorkspaces();
  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
    workspaceId,
  });

  if (isLoadingWorkspaces || isLoadingWorkspace) {
    return <Skeleton className="h-10 w-50" />;
  }

  return (
    <Popover>
      <PopoverTrigger render={<div />} nativeButton={false}>
        <Button variant="ghost" size="sm" className="w-50 justify-between">
          {workspace && workspace.data.name ? (
            <div className="flex items-center gap-2">
              <Avatar className="rounded-md size-7">
                <AvatarImage
                  src={workspace.data.imageUrl}
                  className="rounded-md"
                />
                <AvatarFallback className="bg-teal-500 text-white rounded-md text-xs">
                  {workspace.data.name
                    ? workspace.data.name.charAt(0).toUpperCase()
                    : "W"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{workspace.data.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Workspace Overview</span>
            </div>
          )}
          <CaretDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={8} className="p-0">
        <Command defaultValue="-" disablePointerSelection={true}>
          <CommandInput placeholder="Search workspaces..." />
          <CommandList>
            <CommandEmpty>No command found.</CommandEmpty>
            <CommandGroup heading="Workspaces">
              {workspaces?.data.total && workspaces?.data.total > 0 ? (
                workspaces?.data.rows.map((workspace) => (
                  <CommandItem
                    key={workspace.$id}
                    value={workspace.name}
                    onSelect={() => router.push(`/workspace/${workspace.$id}`)}
                  >
                    <div className="relative size-8 overflow-hidden rounded-md">
                      <span className="text-sm font-semibold text-white bg-teal-500 w-full h-full text-center flex items-center justify-center">
                        {workspace.name.charAt(0).toUpperCase()}
                      </span>
                      {workspace.imageUrl && (
                        <Image
                          src={workspace.imageUrl}
                          alt="workspace logo"
                          fill
                          className="object-cover"
                          sizes="(max-width: 100vw) 32px"
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {workspace.name}
                    </span>
                  </CommandItem>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No workspaces found.
                </p>
              )}
            </CommandGroup>
            <CommandSeparator className="my-2" />
            <CommandGroup heading="Actions">
              <CommandItem>
                <PlusIcon className="mr-2 h-4 w-4" />
                <span>New Workspace</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { WorkspaceSwitcher };
