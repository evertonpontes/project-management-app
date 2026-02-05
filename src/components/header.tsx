"use client";

import Image from "next/image";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Separator } from "./ui/separator";
import { UserButton } from "./user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="flex h-full bg-background sticky top-0 w-full items-center px-4 py-2 border-b border-border">
      <nav className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="w-24 h-8 overflow-hidden relative">
            <Image
              src="/light-logo.svg"
              alt="logo"
              fill
              className="absolute object-contain hidden dark:block"
            />
            <Image
              src="/dark-logo.svg"
              alt="logo"
              fill
              className="absolute object-contain dark:hidden"
            />
          </div>
          <Separator orientation="vertical" className="mx-2" />
          <WorkspaceSwitcher />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <MagnifyingGlassIcon weight="bold" />
          </Button>
          <UserButton />
        </div>
      </nav>
    </header>
  );
};

export { Header };
