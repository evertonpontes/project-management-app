import { KanbanIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="grid min-h-svh w-full lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-start justify-between p-6 md:p-10 bg-primary">
        <Link href="/">
          <div className="flex items-center gap-4 tracking-tight text-2xl font-medium text-primary-foreground">
            <KanbanIcon weight="fill" size={36} />
            <span className="select-none">Plantask</span>
          </div>
        </Link>

        <div className="flex w-full flex-col gap-2">
          <h1 className="text-4xl font-medium tracking-tight leading-12 text-white">
            The simplest way to manage your projects
          </h1>
          <p className="text-lg font-medium tracking-wide leading-8 text-white">
            Organize your tasks, collaborate with your team, and track your
            progress in one place.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-white/60">
            &copy; {new Date().getFullYear()} Plantask Inc. All rights reserved.
          </p>
        </div>
      </div>
      <div className="flex flex-col p-6 md:p-10 bg-background">
        <Link href="/" className="lg:hidden">
          <div className="flex items-center gap-4 tracking-tight text-2xl font-medium text-primary">
            <KanbanIcon weight="fill" size={36} />
            <span className="select-none">Plantask</span>
          </div>
        </Link>
        <div className="flex h-full items-center justify-center w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
