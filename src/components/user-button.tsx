import { redirect } from "next/navigation";
import { useTheme } from "next-themes";
import { SignOutIcon, UserIcon } from "@phosphor-icons/react";

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
import { Skeleton } from "./ui/skeleton";

const UserButton = () => {
  const { data: user, isLoading } = useCurrentUser();
  const { mutate } = useLogout();
  const { setTheme, theme } = useTheme();

  const pictureUrl =
    process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT! +
    `/avatars/initials?name=${user?.data.name.split(" ").splice(0, 2).join("+")}&width=100&height=100`;

  if (isLoading) return <Skeleton className="size-8 rounded-full" />;

  if (!isLoading && !user) redirect("/sign-in");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={pictureUrl} alt="avatar" />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-56"
        sideOffset={8}
      >
        <DropdownMenuGroup>
          <Avatar className="mx-auto size-10 mt-2">
            <AvatarImage src={pictureUrl} alt="avatar" />
          </Avatar>
          <div className="flex flex-col items-center justify-center py-2">
            <p className="text-sm font-semibold text-muted-foreground tracking-tight leading-tight">
              {user?.data.name}
            </p>
            <p className="text-xs text-muted-foreground">{user?.data.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-sm text-muted-foreground">
            Account
            <DropdownMenuShortcut>
              <UserIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-sm text-muted-foreground"
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
          <DropdownMenuLabel className="text-sm">Theme</DropdownMenuLabel>
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="w-fit ml-4 py-2"
          >
            <div className="flex items-center gap-3 text-muted-foreground">
              <RadioGroupItem value="light" id="r1" />
              <Label htmlFor="r1">Light</Label>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <RadioGroupItem value="dark" id="r2" />
              <Label htmlFor="r2">Dark</Label>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
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
