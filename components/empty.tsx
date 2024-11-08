import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface EmptyProps {
  label: string;
}

export const Empty = ({ label }: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <motion.div
        className="relative h-72 w-72"
        animate={{
          y: [0, -10, 0], 
          scale: [1, 1.05, 1], 
          rotate: [0, 2, -2, 0], 
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image alt="empty" fill src="/chat ai.png" />
      </motion.div>
      <motion.p
        className="text-muted-foreground text-sm text-center mt-4"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.05, color: "#9333ea" }} 
      >
        {label}
      </motion.p>
    </div>
  );
};
