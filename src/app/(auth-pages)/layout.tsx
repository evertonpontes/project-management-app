interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex flex-1 justify-center items-center p-4 sm:p-6 lg:p-8 w-full min-h-dvh">
      {children}
    </main>
  );
}
