"use client";

import { RiNotification3Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "cn";

interface NotificationButtonProps {
    className?: string;
}

export function NotificationButton({ className }: NotificationButtonProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Notifications"
                        className={cn("relative", className)}
                    />
                }
            >
                <RiNotification3Line className="size-4" />
                <span className="sr-only">Notifications</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-80 p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="font-semibold text-sm">Notifications</span>
                </div>
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-sm">
                    <RiNotification3Line className="size-8 text-muted-foreground/40 mb-2" />
                    <p className="font-medium text-foreground">No notifications</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        You have no unread notifications at this time.
                    </p>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
