import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="grid lg:grid-cols-2 min-h-svh w-full">
      <div className="hidden h-full min-h-svh w-full bg-linear-to-br from-indigo-500 to-indigo-600 lg:flex justify-between flex-col z-10 text-center p-8">
        <Link href="/">
          <div className="w-40 h-10 overflow-hidden relative">
            <Image
              src="/light-logo.svg"
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        <div className="flex flex-col items-center gap-6 text-center text-wrap">
          <h1 className="text-5xl text-white tracking-tight leading-13">
            Most powerful tool of project management for your team.
          </h1>
          <p className="text-xl text-white leading-9">
            With Plantask, you can easily plan and track your works.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">
            &copy; 2026 Plantask. All rights reserved
          </span>

          <a href="*" className="text-sm text-muted">
            Privacy Policy
          </a>
        </div>
      </div>
      <div className="h-full min-h-svh w-full bg-background flex items-center flex-col z-10 text-center p-6 md:p-8">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
