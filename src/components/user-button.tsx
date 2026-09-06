"use client";

import { createClient } from "@/lib/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useCurrentUser } from "@/features/auth";
import { RiComputerLine, RiContrastLine, RiLogoutBoxLine, RiMoonLine, RiSettings4Line, RiSunLine, RiUserLine } from "@remixicon/react";

export function UserButton() {
  const supabase = createClient();

  const router = useRouter();

  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return <div className="bg-muted border-border size-8 animate-pulse rounded-full border duration-150" />;
  }

  if (!data) {
    redirect("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">{(data.user_metadata?.full_name as string).slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] p-2 md:w-[250px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="bg-muted mb-2 rounded-md">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">{(data.user_metadata?.full_name as string).slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col">
                <span className="text-foreground text-sm font-semibold tracking-tight">{data.user_metadata?.full_name as string}</span>
                <span className="text-muted-foreground text-xs tracking-tighter">{data.email as string}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <RiUserLine />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RiSettings4Line />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <RiContrastLine />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup>
                <DropdownMenuRadioItem value="dark">
                  <RiMoonLine />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">
                  <RiSunLine />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <RiComputerLine />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="-mx-2" />
        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();

            router.push("/login");
          }}
        >
          <RiLogoutBoxLine />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
