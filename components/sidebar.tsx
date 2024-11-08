"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { CodeXml, Headphones, ImagePlus, LayoutGridIcon, MessageCircle, MessageSquareText, MonitorPlay, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"]
});

const routes = [
    {
        label: "Command Center",
        icon: LayoutGridIcon,
        href: "/dashboard",
        color: "text-sky-400",
    },
    {
        label: "Smart Chat",
        icon: MessageSquareText,
        href: "/smartchat",
        color: "text-violet-400",
    },
    {
        label: "Image Generator",
        icon: ImagePlus,
        href: "/image",
        color: "text-pink-600",
    },
    {
        label: "Video Creator",
        icon: MonitorPlay,
        href: "/video",
        color: "text-orange-600",
    },
    {
        label: "Music Composer",
        icon: Headphones,
        href: "/music",
        color: "text-emerald-400",
    },
    {
        label: "Code Assistant",
        icon: CodeXml,
        href: "/code",
        color: "text-blue-400",
    },
    {
        label: "Feedback Hub",
        icon: MessageCircle,
        href: "/feedback",
        color: "text-yellow-400",
    },
    {
        label: "Control Panel",
        icon: Settings,
        href: "/settings",
        color: "text-slate-300",
    },
];

const Sidebar = () => {
    const [showWelcome, setShowWelcome] = useState(false);
    const pathname = usePathname();

    return (
        <motion.div
            className="space-y-4 py-4 flex flex-col h-full bg-gradient-to-br from-gray-800 via-gray-950 to-gray-800  text-white w-64 md:w-72"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div
                        className="relative w-8 h-8 mr-4"
                        onMouseEnter={() => setShowWelcome(true)}
                        onMouseLeave={() => setShowWelcome(false)}
                    >
                        <Image
                            fill
                            alt="Logo"
                            src="/logo.png"
                        />
                        {showWelcome && (
                            <div
                                className="absolute ml-4 top-14 transform -translate-y-1/2">
                                <div className="relative px-2 py-2 rounded-md overflow-hidden">
                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                    <p className="relative z-10 text-white text-sm whitespace-nowrap lg:text-base">
                                        Hi! Welcome to CreatiAI
                                        <span className="ml-1 inline-block animate-wave">👋</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <h1 className={cn("text-2xl font-bold", montserrat.className)}>
                        CreatiAI
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <motion.div
                            key={route.href}
                            whileTap={{ scale: 0.99 }}
                        >
                            <Link
                                href={route.href}
                                className={cn("text-sm group flex p-4 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-lg transition",
                                    pathname === route.href ? "text-white bg-white/10 backdrop-blur-sm" : "text-gray-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-6 w-6 mr-3", route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default Sidebar;
