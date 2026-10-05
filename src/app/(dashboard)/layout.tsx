import { AppSidebar } from "@/components/main-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar collapsible="icon" />
            <main>{children}</main>
        </SidebarProvider>
    );
}