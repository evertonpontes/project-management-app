"use client";

import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { UserButton } from "./user-button";

export function NavBar() {
  return (
    <header className="border-border bg-background sticky top-0 flex w-full items-center border-b px-4">
      <nav className="text-foreground flex h-12 w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <div className="flex w-auto items-center gap-2 overflow-hidden">
            <span className="text-primary text-2xl font-bold tracking-tight md:text-lg">
              Workflow
            </span>
          </div>
        </div>

        <UserButton />
      </nav>
    </header>
  );
}
