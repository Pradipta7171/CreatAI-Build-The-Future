import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
               <Sidebar />
            </div>
            <main className="md:pl-72 bg-gradient-to-br from-purple-50 via-pink-50 to-red-100">
                <Navbar />
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;

