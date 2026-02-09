"use client";

import { useTheme } from "next-themes";
import { CaretUpDownIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { SidebarMenuButton } from "./ui/sidebar";

const UserButton = () => {
  const { data: user } = useCurrentUser();
  const { mutate } = useLogout();
  const { setTheme, theme } = useTheme();

  const pictureUrl =
    process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT! +
    `/avatars/initials?name=${user?.data.name.split(" ").splice(0, 2).join("+")}&width=100&height=100`;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        render={<SidebarMenuButton className="h-full w-full" />}
      >
        <Avatar>
          <AvatarImage src={pictureUrl} alt="avatar" />
        </Avatar>
        <div className="flex flex-col gap-0.5 w-full">
          <p className="text-sm font-semibold text-foreground tracking-tight leading-tight">
            {user?.data.name}
          </p>
          <p className="text-xs text-foreground">{user?.data.email}</p>
        </div>
        <CaretUpDownIcon className="text-muted-foreground ml-auto shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuGroup>
          <div className="flex items-center gap-2 w-full p-2">
            <Avatar>
              <AvatarImage src={pictureUrl} alt="avatar" />
            </Avatar>
            <div className="flex flex-col gap-0.5 w-full">
              <p className="text-sm font-semibold text-muted-foreground tracking-tight leading-tight">
                {user?.data.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.data.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-sm text-foreground">
            Account
            <DropdownMenuShortcut>
              <UserIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-sm text-foreground"
            onClick={() => {
              mutate();
            }}
          >
            Log Out
            <DropdownMenuShortcut>
              <SignOutIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm text-foreground">
            Theme
          </DropdownMenuLabel>
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="w-fit ml-4 py-2"
          >
            <div className="flex items-center gap-3 text-foreground">
              <RadioGroupItem value="light" id="r1" />
              <Label htmlFor="r1">Light</Label>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <RadioGroupItem value="dark" id="r2" />
              <Label htmlFor="r2">Dark</Label>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <RadioGroupItem value="system" id="r3" />
              <Label htmlFor="r3">System</Label>
            </div>
          </RadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserButton };
