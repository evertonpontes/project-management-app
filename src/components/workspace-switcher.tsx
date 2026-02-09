"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { CaretUpDownIcon, PlusIcon } from "@phosphor-icons/react";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandGroup,
  CommandList,
  CommandEmpty,
  CommandSeparator,
  CommandItem,
} from "./ui/command";
import { useGetWorkspaces } from "@/features/workspace/hooks/use-get-workspaces";

const WorkspaceSwitcher = () => {
  const router = useRouter();
  const params = useParams<{ workspaceId?: string }>();
  const valueRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const { data: workspaces } = useGetWorkspaces();

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open);
  }, []);

  const handleSelectWorkspace = useCallback(
    ({ workspaceId }: { workspaceId: string }) => {
      if (!workspaces) return;

      const workspace = workspaces.data.rows.find((w) => w.$id === workspaceId);

      if (!workspace) return;

      const contentHTML = `
      <div class="flex items-center gap-2">
            <div class="relative rounded-md size-7 overflow-hidden">
              ${
                workspace.imageUrl
                  ? `<img
                src=${workspace.imageUrl}
                class="absolute size-7 rounded-md"
              />`
                  : ""
              }
              <span class="text-sm font-semibold text-white bg-teal-500 w-full h-full text-center flex items-center justify-center">
                ${workspace.name ? workspace.name.charAt(0).toUpperCase() : "W"}
              </span>
            </div>
            <span class="text-sm font-medium">${workspace.name}</span>
          </div>
    `;

      if (valueRef.current) {
        valueRef.current.innerHTML = contentHTML;
      }
    },
    [workspaces],
  );

  useEffect(() => {
    if (valueRef.current && params.workspaceId) {
      handleSelectWorkspace({ workspaceId: params.workspaceId });
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger className="flex items-center justify-between p-2 w-full hover:bg-muted rounded-sm">
        <div ref={valueRef}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Workspace Overview</span>
          </div>
        </div>

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
                    value={workspace.$id}
                    onSelect={(value) => {
                      handleSelectWorkspace({ workspaceId: value });
                      router.push(`/workspace/${value}`);
                      setOpen(false);
                    }}
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
