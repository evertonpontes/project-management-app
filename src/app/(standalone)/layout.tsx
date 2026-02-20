import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";
import {
  BellIcon,
  KanbanIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <div className="flex min-h-svh flex-col w-full">
      <header className=" sticky top-0 w-full bg-sidebar border-b border-sidebar-accent-foreground/10 shadow-xs">
        <nav className="flex w-full items-center justify-between p-2">
          <Link href={"/workspaces"}>
            <KanbanIcon weight="fill" className="text-primary size-8" />
          </Link>

          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon">
              <MagnifyingGlassIcon className="size-5 text-card-foreground/85" />
            </Button>

            <Button variant="ghost" size="icon">
              <BellIcon className="size-5 text-card-foreground/85" />
            </Button>

            <UserButton />
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
};

export default StandaloneLayout;
