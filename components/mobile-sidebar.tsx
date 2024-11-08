"use client";

import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from './sidebar';

const MobileSidebar = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent 
                side="left"
                className="p-0 w-64 bg-gradient-to-br from-gray-800 via-gray-950 to-gray-800 text-white"
            >
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}

export default MobileSidebar;
