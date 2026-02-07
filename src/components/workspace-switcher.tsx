"use client";

import { CaretUpDownIcon, PlusIcon } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandGroup,
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
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-between p-2 w-full hover:bg-muted rounded-sm">
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
        <CaretUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent align="start" side="bottom" className="p-0 w-60">
        <Command defaultValue="-" disablePointerSelection={true}>
          <CommandList>
            <CommandEmpty>No command found.</CommandEmpty>
            <CommandGroup heading="Workspaces">
              {workspaces?.data &&
              "rows" in workspaces.data &&
              workspaces.data.rows.length > 0 ? (
                workspaces.data.rows.map((workspace) => (
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
                    <span className="text-sm font-medium truncate">
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
            <CommandGroup>
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
