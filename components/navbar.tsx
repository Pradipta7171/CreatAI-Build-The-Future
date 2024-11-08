import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/mobile-sidebar";

const Navbar = () => {
    return (
        <div className="flex items-center p-4">
            <MobileSidebar />
            <div className="flex w-full justify-end">
                <div className="transform scale-100 sm:scale-110 md:scale-125 lg:scale-125"> 
                    <UserButton />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
