"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const [time, setTime] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Update time every second with UTC formatting to avoid locale issues
    const timer = setInterval(() => {
      const now = new Date();
      // Use UTC formatting to ensure consistent rendering between server and client
      const hours = now.getUTCHours().toString().padStart(2, '0');
      const minutes = now.getUTCMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 to-black border-t border-gray-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Portfolio
              </Link>
              <p className="text-gray-400 max-w-md">
                Crafting digital experiences with precision, passion, and cutting-edge technology.
              </p>
              
              {/* Live time display */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Current Time | {time} UTC</span>
              </div>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Navigate</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Home</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About</Link></li>
                <li><Link href="/skills" className="text-gray-400 hover:text-white transition-colors duration-300">Skills</Link></li>
                <li><Link href="/projects" className="text-gray-400 hover:text-white transition-colors duration-300">Projects</Link></li>
              </ul>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/experience" className="text-gray-400 hover:text-white transition-colors duration-300">Experience</Link></li>
                <li><Link href="/resume" className="text-gray-400 hover:text-white transition-colors duration-300">Resume</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</Link></li>
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Let's Connect</h3>
              <p className="text-gray-400 text-sm">
                Have a project in mind? Let's create something amazing together.
              </p>
              <Link 
                href="/contact"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Get In Touch
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Advanced Copyright Section */}
        <motion.div 
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
            <p className="text-gray-500 text-sm">
              {/* Use UTC full year to avoid locale issues */}
              © {new Date().getUTCFullYear()} Mahammad Aftab. All rights reserved.
            </p>
          </div>
          
          <motion.div 
            className="mt-4 md:mt-0 flex space-x-4"
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