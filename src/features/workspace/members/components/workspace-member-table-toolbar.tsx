"use client";

import { RiCloseLine, RiSearchLine } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface WorkspaceMemberTableToolbarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function WorkspaceMemberTableToolbar({
    value,
    onChange,
    placeholder = "Search members by name or email...",
    className = "",
}: WorkspaceMemberTableToolbarProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative w-full max-w-sm">
                <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="pl-9 pr-9"
                    aria-label="Search members"
                />
                {value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onChange("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Clear search"
                    >
                        <RiCloseLine className="size-3.5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
