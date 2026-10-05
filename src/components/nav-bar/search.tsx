"use client";

import { RiSearchLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

interface SearchProps {
    className?: string;
}

export function Search({ className }: SearchProps) {
    return (
        <div className={cn("relative flex items-center", className)}>
            {/* Small screen: variant ghost, size icon, icon only */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Search"
                type="button"
            >
                <RiSearchLine className="size-4" />
            </Button>

            {/* Other screens: variant outline, with text */}
            <Button
                variant="outline"
                className="hidden md:inline-flex items-center justify-between gap-2 h-9 px-3 w-44 lg:w-60 text-muted-foreground hover:text-foreground font-normal"
                aria-label="Search"
                type="button"
            >
                <div className="flex items-center gap-2 truncate">
                    <RiSearchLine className="size-4 shrink-0" />
                    <span className="text-sm truncate">Search...</span>
                </div>
                <kbd className="pointer-events-none hidden sm:inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
        </div>
    );
}

export { Search as SearchButton };
