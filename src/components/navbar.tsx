"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Projects", href: "/projects" },
  { name: "Experience", href: "/experience" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "py-2 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg" 
          : "py-4 bg-white/80 dark:bg-black/80 backdrop-blur-lg"
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <nav
        className="flex items-center justify-between px-6 md:px-12"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/" 
              className="group flex items-center -m-1.5 p-1.5 text-2xl font-bold"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                Portfolio
              </span>
              <motion.span 
                className="ml-2 text-blue-500 dark:text-blue-400"
                animate={{ 
                  y: [0, -2, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ✨
              </motion.span>
            </Link>
          </motion.div>
        </div>
        
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-1">
          {navigation.map((item) => (
            <div key={item.name} className="relative px-2">
              <Link
                href={item.href}
                className={`text-sm font-medium leading-6 transition-all duration-300 px-3 py-2 rounded-lg ${
                  pathname === item.href
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                    : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                }`}
              >
                {item.name}
              </Link>
              
              {pathname === item.href && (
                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                  layoutId="activeNavLink"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            className="rounded-full p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <span className="sr-only">Toggle theme</span>
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SunIcon className="h-5 w-5" aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MoonIcon className="h-5 w-5" aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          
          <motion.div
            className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-2 relative inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <span className="relative z-10">Hire Me</span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100"
              initial={false}
              animate={{ 
                x: ["-100%", "100%"] 
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </motion.button>
        </div>
      </nav>
      
      {/* Animated underline that spans full width on hover */}
      <motion.div 
        className="h-0.5 bg-gradient-to-r from-blue-500/20 via-blue-500 to-blue-500/20 mt-2"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovering ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                      : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Theme</span>
                <button
                  type="button"
                  className="rounded-full p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <span className="sr-only">Toggle theme</span>
                  {theme === "dark" ? (
                    <SunIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}