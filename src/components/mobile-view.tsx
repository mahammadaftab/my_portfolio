"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
  SunIcon, 
  MoonIcon, 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  UserIcon,
  CodeBracketIcon,
  FolderIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "About", href: "/about", icon: UserIcon },
  { name: "Skills", href: "/skills", icon: CodeBracketIcon },
  { name: "Projects", href: "/projects", icon: FolderIcon },
  { name: "Experience", href: "/experience", icon: BriefcaseIcon },
  { name: "Resume", href: "/resume", icon: DocumentTextIcon },
  { name: "Contact", href: "/contact", icon: EnvelopeIcon },
];

export default function MobileView() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile/tablet
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  // Close mobile menu when pathname changes (navigation occurs)
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Mobile menu button - fixed position */}
      <div className="lg:hidden fixed top-4 right-4 z-40">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-700 shadow-lg dark:bg-gray-800 dark:text-gray-300"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile menu overlay and panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile menu panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="-m-1.5 p-1.5 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Portfolio
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                {/* Navigation items */}
                <div className="space-y-2 py-6">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`-mx-3 flex items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors ${
                          pathname === item.href
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
                
                {/* Theme toggle */}
                <div className="py-6">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                      setMobileMenuOpen(false);
                    }}
                  >
                    {theme === "dark" ? (
                      <>
                        <SunIcon className="h-5 w-5" aria-hidden="true" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <MoonIcon className="h-5 w-5" aria-hidden="true" />
                        Dark Mode
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}