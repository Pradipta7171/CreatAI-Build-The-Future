"use client";

import React, { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRightCircle, MessageSquareText, CodeXml, Headphones, ImagePlus, MonitorPlay, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const tools = [
  {
    label: "Smart Chat",
    icon: MessageSquareText,
    href: "/smartchat",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    description: "Engage in intelligent conversations with our AI"
  },
  {
    label: "Music Composer",
    icon: Headphones,
    href: "/music",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    description: "Create unique melodies with AI-powered music generation"
  },
  {
    label: "Image Generator",
    icon: ImagePlus,
    href: "/image",
    color: "text-pink-600",
    bgColor: "bg-pink-500/10",
    description: "Transform your ideas into stunning visuals"
  },
  {
    label: "Video Creator",
    icon: MonitorPlay,
    href: "/video",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    description: "Bring your stories to life with AI-generated videos"
  },
  {
    label: "Code Assistant",
    icon: CodeXml,
    href: "/code",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    description: "Streamline your development with AI-assisted coding"
  },
  {
    label: "Feedback Hub",
    icon: MessageCircle,
    href: "/feedback",
    color: "text-yellow-500",
    bgColor: "bg-yellow-400/10",
    description: "Share your thoughts and help us improve our AI tools"
  }
];

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    tools.forEach(tool => {
      router.prefetch(tool.href);
    });
  }, [router]);

  // Optimized navigation function
  const navigateToTool = useCallback((href: string) => {
    router.push(href);
  }, [router]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-100 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Power of AI</span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-lg sm:text-md md:text-lg text-gray-500">
            Unleash creativity and boost productivity with our cutting-edge AI tools
          </p>
        </motion.div>

        <div className="mt-8 sm:mt-12 md:mt-16">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  onClick={() => navigateToTool(tool.href)}
                  className="group h-full p-6 sm:p-8 border-none rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 transform scale-[102%] group-hover:scale-[101%] transition-transform duration-300 ease-out" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className={cn("p-3 sm:p-4 rounded-xl", tool.bgColor)}>
                        <tool.icon className={cn("w-6 h-6 sm:w-8 sm:h-8", tool.color)} />
                      </div>
                      <ArrowRightCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-gray-700 transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-gray-700 transition-colors duration-300">{tool.label}</h3>
                    <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray-500 transition-colors duration-300">{tool.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;