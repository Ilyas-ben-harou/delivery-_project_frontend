import { Bell, Menu } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";

export function AdminHeader() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-white px-6 shadow-sm">
            <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
            <div className="flex-1" />
            <NotificationDropdown />
            <div></div>
        </header>
    );
}

// Sidebar trigger button component
function SidebarTrigger({ className }) {
    // This would typically toggle your sidebar
    const toggleSidebar = () => {
        // Implementation depends on your sidebar state management
        console.log("Toggle sidebar");
    };

    return (
        <button
            onClick={toggleSidebar}
            className={`flex items-center justify-center rounded-full p-2 hover:bg-gray-100 ${className}`}
        >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
        </button>
    );
}