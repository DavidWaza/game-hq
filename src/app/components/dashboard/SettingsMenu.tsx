"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Gear } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Settings categories with their respective items
  const settingsCategories = [
    {
      category: "Account",
      items: [
        { label: "Profile Settings", href: "/account/profile", icon: "👤" },
        { label: "Privacy", href: "/account/privacy", icon: "🔒" },
        { label: "Subscription", href: "/account/subscription", icon: "💰" },
      ],
    },

    {
      category: "System",
      items: [
        { label: "Notifications", href: "/system/notifications", icon: "🔔" },
        { label: "Help & Support", href: "/support", icon: "❓" },
        { label: "Logout", href: `#`, icon: "🚪" },
      ],
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className="w-10 h-10 flex items-center justify-center"
            onClick={toggleMenu}
          >
            <Gear
              size={32}
              weight="duotone"
              color="#fcf8db"
              className={`hover:animate-spin ${isOpen ? "animate-spin" : ""}`}
            />
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 rounded-md shadow-lg z-50"
          >
            <div className="bg-gradient-to-br from-[#233d4d] via-[#2c586b] to-[#101820] rounded-md border-2 border-[#fcf8db] overflow-hidden">
              <div className="py-1">
                {settingsCategories.map((category, catIndex) => (
                  <div key={catIndex} className="mb-2">
                    <div className="px-4 py-2 bg-[#101820] text-[#f37f2d] font-bold border-t border-b border-[#fcf8db] text-sm uppercase tracking-wider">
                      {category.category}
                    </div>
                    {category.items.map((item, itemIndex) => (
                      <Link href={item.href} key={itemIndex}>
                        <div
                          className="group px-4 py-2 flex items-center hover:bg-[#f37f2d] transition-all duration-200 cursor-pointer"
                          onClick={item.label === "Logout" ? logout : undefined}
                        >
                          <span className="mr-3 text-lg">{item.icon}</span>
                          <span className="text-[#fcf8db] group-hover:translate-x-1 transition-transform duration-200">
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsMenu;
