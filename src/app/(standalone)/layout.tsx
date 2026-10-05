import Link from "next/link";
import { RiArrowLeftLine } from "@remixicon/react";
import { NotificationButton, Search } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";

interface StandaloneLayoutProps {
    children: React.ReactNode;
}

export default function StandaloneLayout({ children }: StandaloneLayoutProps) {
    return (
        <main className="relative flex flex-col flex-1 bg-background w-full min-h-screen text-foreground">
            <header className="top-0 z-50 sticky flex justify-between items-center gap-4 bg-background px-4 border-b h-16 shrink-0">
                <Button
                    variant="ghost"
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/workspaces" />}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                    aria-label="Return to workspaces"
                >
                    <RiArrowLeftLine className="size-4" />
                    <span className="hidden sm:inline">Back to workspaces</span>
                    <span className="sm:hidden">Workspaces</span>
                </Button>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Search />
                    <NotificationButton />
                    <UserButton />
                </div>
            </header>
            {children}
        </main>
    );
}

