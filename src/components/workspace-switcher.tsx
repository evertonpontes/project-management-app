"use client";

import React from "react";

import { CaretDownIcon, PlusIcon, PlusSquareIcon } from "@phosphor-icons/react";
import { Avatar, AvatarFallback } from "./ui/avatar";
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

const workspaces = [
  { name: "Workspace 1", id: 1 },
  { name: "Workspace 2", id: 2 },
  { name: "Workspace 3", id: 3 },
];

const WorkspaceSwitcher = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger render={<div />} nativeButton={false}>
        <Button variant="ghost" size="sm">
          <div className="flex items-center gap-2">
            <Avatar className="rounded-md size-7">
              <AvatarFallback className="bg-teal-500 text-white rounded-md text-xs">
                WS
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Workspace Example</span>
          </div>
          <CaretDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        <PopoverContent align="start" sideOffset={8} className="p-0">
          <Command defaultValue="-" disablePointerSelection={true}>
            <CommandList>
              <CommandEmpty>No workspaces found.</CommandEmpty>
              <CommandGroup>
                {workspaces.map((workspace) => (
                  <CommandItem key={workspace.id} value={workspace.name}>
                    <Avatar className="rounded-md size-7">
                      <AvatarFallback className="bg-teal-500 text-white rounded-md text-xs">
                        WS
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {workspace.name}
                    </span>
                  </CommandItem>
                ))}
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
      </PopoverTrigger>
    </Popover>
  );
};

export { WorkspaceSwitcher };
