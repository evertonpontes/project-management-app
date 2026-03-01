"use client";

import { Models } from "node-appwrite";
import { customTaskFieldIcons } from "../schemas";
import { Button } from "@/components/ui/button";
import {
  DotsThreeVerticalIcon,
  PencilSimpleLineIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomFieldItemProps {
  field: Models.Row & { name: string; kind: string; [key: string]: string };
}

const CustomFieldItem = ({ field }: CustomFieldItemProps) => {
  const Icon = customTaskFieldIcons[field.kind];

  return (
    <div className="flex group items-center gap-4 justify-between w-full p-2 hover:bg-primary/10 rounded-md transition-all">
      <div className="flex items-center gap-2">
        <Icon className="size-6 md:size-4 text-muted-foreground" />
        <span className="text-base md:text-sm truncate">{field.name}</span>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="link"
                size="icon"
                className="invisible group-hover:visible transition-all"
              >
                <DotsThreeVerticalIcon className="size-6 md:size-4 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent className="w-50">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <PencilSimpleLineIcon className="size-6 md:size-4 text-muted-foreground" />
                Edit custom field
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <TrashIcon className="size-6 md:size-4 text-destructive" />
                Edit custom field
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CustomFieldItem;
