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
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

interface UserButtonProps {
  sidebar?: boolean;
  variant?: "Default" | "Icon";
  rounded?: "full" | "lg";
}

const UserButton = ({
  sidebar = true,
  variant = "Default",
  rounded = "lg",
}: UserButtonProps) => {
  const { data: user, isLoading } = useCurrent();
  const { mutate } = useSignOut();

  const Comp = ({ ...props }: ComponentProps<"button">) =>
    sidebar ? (
      <SidebarMenuButton
        variant="default"
        size="lg"
        className={cn(
          "gap-2",
          rounded === "full" ? "rounded-full p-0" : "rounded-lg",
          variant === "Icon" && "w-8 h-8",
        )}
        {...props}
      />
    ) : (
      <Button
        variant="ghost"
        size="lg"
        className={cn(
          "gap-2",
          rounded === "full" ? "rounded-full p-0" : "rounded-lg",
          variant === "Icon" && "w-8 h-8",
        )}
        {...props}
      />
    );

  const fallbackName = user?.data.name.charAt(0).toLocaleUpperCase();

  if (!isLoading && !user) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={
          <Comp>
            <Avatar
              className={cn(
                "h-8 w-8",
                rounded === "full" ? "rounded-full" : "rounded-lg",
              )}
            >
              <AvatarFallback
                className={cn(
                  "bg-primary text-primary-foreground",
                  rounded === "full" ? "rounded-full" : "rounded-lg",
                )}
              >
                {fallbackName}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "flex flex-col text-start",
                variant === "Icon" && "hidden",
              )}
            >
              <span className="truncate font-semibold">{user?.data.name}</span>
              <span className="truncate text-muted-foreground text-xs">
                {user?.data.email}
              </span>
            </div>
            <CaretUpDownIcon className={cn(variant === "Icon" && "hidden")} />
          </Comp>
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
