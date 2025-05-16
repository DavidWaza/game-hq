import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface DropDownProps {
  toolTip: string;
  header: React.ReactNode; // Slot for the header
  content: React.ReactNode; // Slot for the content
}

const DropDown: React.FC<DropDownProps> = ({ header, content, toolTip }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="relative" ref={menuRef}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className="w-10 h-10 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          >
            {header} {/* Render the header slot */}
          </TooltipTrigger>
          <TooltipContent>{toolTip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
            className="absolute min-w-64 top-12 -right-2 rounded-md shadow-lg z-50"
          >
            <div className="bg-gradient-to-br from-[#233d4d] via-[#2c586b] to-[#101820] rounded-md border-2 border-[#fcf8db] overflow-hidden w-full">
              {content} {/* Render the content slot */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropDown;
