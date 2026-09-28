"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth-client";
import {
    RiAccountCircleLine,
    RiSettings3Line,
    RiPaletteLine,
    RiLogoutBoxRLine,
    RiSunLine,
    RiMoonLine,
    RiComputerLine,
} from "@remixicon/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getInitials(name?: string | null): string {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserButton() {
    const { data: session } = useSession();
    const { setTheme } = useTheme();
    const router = useRouter();

    const user = session?.user;

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                },
            },
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <Avatar>
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User avatar"} />
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-64">
                {/* User info label */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-sm text-left">
                            <Avatar className="size-8">
                                <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User avatar"} />
                                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 grid text-sm text-left leading-tight">
                                <span className="font-medium truncate">{user?.name ?? "User"}</span>
                                <span className="text-muted-foreground text-xs truncate">
                                    {user?.email ?? ""}
                                </span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Menu items */}
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <RiAccountCircleLine />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <RiSettings3Line />
                        Settings
                    </DropdownMenuItem>

                    {/* Theme submenu */}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <RiPaletteLine />
                            Theme
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <RiSunLine />
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <RiMoonLine />
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                <RiComputerLine />
                                System
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Sign out */}
                <DropdownMenuItem onClick={handleSignOut}>
                    <RiLogoutBoxRLine />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
