import { AppSidebar } from "@/components/app-sidebar";
import { NavBar } from "@/components/nav-bar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="bg-background text-foreground relative flex min-h-screen w-full flex-1 flex-col">
        <NavBar />
        {children}
      </div>
    </SidebarProvider>
  );
}
