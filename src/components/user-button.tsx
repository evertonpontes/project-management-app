"use client";

import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { useCurrent } from "@/features/auth/hooks/use-current";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  CaretUpDownIcon,
  CircleHalfIcon,
  GearIcon,
  MoonIcon,
  PaletteIcon,
  SealCheckIcon,
  SignOutIcon,
  SunIcon,
} from "@phosphor-icons/react";
import { SidebarMenuButton } from "./ui/sidebar";

const UserButton = () => {
  const { data: user, isLoading } = useCurrent();
  const { mutate } = useSignOut();

  const fallbackName = user?.data.name.charAt(0).toLocaleUpperCase();

  if (!isLoading && !user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton size="lg" className="gap-2">
            <Avatar size="lg">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {fallbackName}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-start">
              <span className="truncate font-semibold">{user?.data.name}</span>
              <span className="truncate text-muted-foreground text-xs">
                {user?.data.email}
              </span>
            </div>
            <CaretUpDownIcon />
          </SidebarMenuButton>
        }
      />
      <DropdownMenuContent
        side="bottom"
        align="center"
        sideOffset={10}
        alignOffset={5}
        className="w-64"
      >
        <div className="flex items-center gap-2 py-2 px-4">
          <Avatar size="lg">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {fallbackName}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-start">
            <span className="truncate font-semibold">{user?.data.name}</span>
            <span className="truncate text-muted-foreground text-xs">
              {user?.data.email}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <SealCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GearIcon />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <PaletteIcon />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <SunIcon />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MoonIcon />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CircleHalfIcon />
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => mutate()}>
          <SignOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserButton };
