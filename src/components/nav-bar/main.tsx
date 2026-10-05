"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@/components/user-button";
import { Navigation } from "./navigation";
import { Search } from "./search";
import { NotificationButton } from "./notification-button";
import { cn } from "cn";

interface NavbarProps extends React.ComponentProps<"header"> {}

export function Navbar({ className, ...props }: NavbarProps) {
    return (
        <header
            className={cn(
                "flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4",
                className
            )}
            {...props}
        >
            {/* Left: display SidebarTrigger on small screens, Navigation (breadcrumb) on medium+ screens */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <Navigation className="hidden md:flex" />
            </div>

            {/* Right: Container with search, notifications, and user profile */}
            <div className="flex items-center gap-2 sm:gap-3">
                <Search />
                <NotificationButton />
                <UserButton />
            </div>
        </header>
    );
}
