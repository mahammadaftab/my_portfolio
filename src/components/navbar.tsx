"use client";

import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon, UsersIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Projects", href: "/projects" },
  { name: "Achievements", href: "/experience" },
  { name: "Credly", href: "/credly" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch and increment visitor count
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const hasVisited = sessionStorage.getItem("hasVisited");

        if (!hasVisited) {
          // New session: Increment count
          sessionStorage.setItem("hasVisited", "true");
          const response = await fetch("/api/visitors", { method: "POST" });
          if (response.ok) {
            const data = await response.json();
            setVisitorCount(data.count);
          }
        } else {
          // Existing session: Just get current count
          const response = await fetch("/api/visitors");
          if (response.ok) {
            const data = await response.json();
            setVisitorCount(data.count);
          }
        }
      } catch (error) {
        console.error("Failed to track visitor:", error);
      }
    };

    trackVisitor();
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${isScrolled
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
              suppressHydrationWarning={true}
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors focus:outline-none"
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
                  className={`text-sm font-medium leading-6 transition-all duration-300 px-3 py-2 rounded-lg ${pathname === item.href
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
  
          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
            {/* Visitor Counter */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/60 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700/60 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-500/30">
              <UsersIcon className="w-4 h-4 text-blue-500" />
              <span>Visitors:</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={visitorCount ?? 'loading'}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  className="font-bold text-blue-600 dark:text-blue-400 min-w-[36px] text-center inline-block"
                >
                  {visitorCount !== null ? visitorCount.toLocaleString() : "---"}
                </motion.span>
              </AnimatePresence>
            </div>
  
            <motion.button
              suppressHydrationWarning={true}
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
      </header>
  
      {/* Mobile menu slide-in drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
  
            {/* Glassmorphic Drawer Panel */}
            <motion.div
              className="lg:hidden fixed inset-y-0 right-0 z-[70] w-72 max-w-[85vw] bg-white/85 dark:bg-black/85 backdrop-blur-2xl border-l border-gray-200/50 dark:border-white/10 shadow-2xl flex flex-col p-6 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-white/10">
                <Link
                  href="/"
                  className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Portfolio
                </Link>
                <button
                  suppressHydrationWarning={true}
                  type="button"
                  className="rounded-full p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close main menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
  
              {/* Mobile Visitor Counter */}
              <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2.5 rounded-2xl mb-6 shadow-md shadow-black/5">
                <UsersIcon className="w-4 h-4 text-blue-500" />
                <span>Total Visitors:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 ml-auto">
                  {visitorCount !== null ? visitorCount.toLocaleString() : "---"}
                </span>
              </div>
  
              {/* Navigation Items (Touch friendly spacing) */}
              <div className="flex flex-col gap-1.5">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                      pathname === item.href
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
  
              {/* Action Call To Action */}
              <div className="mt-auto pt-8 flex justify-center">
                <motion.button
                  suppressHydrationWarning={true}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative inline-flex items-center justify-center px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}