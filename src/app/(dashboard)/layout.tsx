import { AppSidebar } from "@/components/main-sidebar";
import { Navbar } from "@/components/nav-bar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar collapsible="icon" />
            <main className="relative flex flex-col flex-1 bg-background w-full text-foreground">
                <Navbar className="sticky inset-0 w-full" />
                {children}
            </main>
        </SidebarProvider>
    );
}