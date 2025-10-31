"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const [time, setTime] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Update time every second with Indian Standard Time (IST)
    const timer = setInterval(() => {
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata'
      };
      
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const now = new Date();
      const indianTime = formatter.format(now);
      setTime(`${indianTime} IST`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 to-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Copyright Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Live time display on the left */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Current Time | {time}</span>
          </div>
          
          {/* Centered copyright */}
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500 text-sm">
              © {new Date().getUTCFullYear()} Mahammad Aftab. All rights reserved.
            </p>
          </div>
          
          {/* Right side - Privacy and Terms */}
          <motion.div 
            className="flex space-x-4"
            animate={{ 
              x: isHovered ? [0, -5, 5, -5, 5, 0] : 0,
              y: isHovered ? [0, -3, 3, -3, 3, 0] : 0
            }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-300">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-300">
              Terms
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}