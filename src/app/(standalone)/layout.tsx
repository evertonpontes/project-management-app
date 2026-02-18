import { UserButton } from "@/components/user-button";
import { KanbanIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <main className="flex min-h-svh flex-col w-full">
      <header className=" sticky top-0 w-full bg-card shadow-xs">
        <nav className="flex w-full items-center justify-between p-2">
          <Link href="/">
            <div className="flex items-center gap-2 tracking-tight text-2xl font-medium text-primary">
              <KanbanIcon weight="fill" size={24} />
              <span className="select-none text-base">Plantask</span>
            </div>
          </Link>

          <UserButton rounded="full" sidebar={false} variant="Icon" />
        </nav>
      </header>
      {children}
    </main>
  );
};

export default StandaloneLayout;
