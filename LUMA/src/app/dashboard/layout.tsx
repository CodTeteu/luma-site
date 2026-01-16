import Sidebar from "@/components/dashboard/Sidebar";
import { ToastContainer } from "@/components/ui/Toast";
import LeafShadowOverlay from "@/components/ui/LeafShadowOverlay";

export const metadata = {
    title: "Dashboard | LUMA",
    description: "Gerencie seu casamento com a LUMA",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F7F5F0] font-sans selection:bg-[#C19B58] selection:text-white">
            <LeafShadowOverlay />
            <ToastContainer />

            {/* Sidebar Navigation */}
            <Sidebar userName="Ana & Pedro" />

            {/* Main Content Area */}
            <main className="md:ml-64 pt-16 md:pt-0 min-h-screen relative z-10">
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
