"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CaretDown, CaretRight, SidebarSimple } from "@phosphor-icons/react";
// Updated navigation structure with icons at category level
const navigationLinks = [
  {
    category: "Action Games",
    icon: "/assets/icons/cod.svg",
    items: [
      { name: "Call of Duty", href: "/profile" },
      { name: "Mortal Kombat", href: "/profile" },
      { name: "Need for Speed", href: "/profile" },
    ],
  },
  {
    category: "Sports Games",
    icon: "/assets/icons/fc-25.svg",
    items: [
      { name: "FC 25", href: "/" },
      { name: "e-Football", href: "/profile" },
      { name: "NBA 2K25", href: "/profile" },
      { name: "Formula 1", href: "/profile" },
    ],
  },
  {
    category: "Board Games",
    icon: "/assets/icons/chess.svg",
    items: [
      { name: "Chess", href: "/profile" },
      { name: "Ludo", href: "/profile" },
    ],
  },
  {
    category: "Dice Games",
    icon: "/assets/icons/dice.svg",
    items: [{ name: "Dice", href: "/profile" }],
  },
];

interface SidebarActionProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarActionProps) => {
  // State to track which category dropdowns are open
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});

  // State to track if we're on mobile view
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      // Create a new object with all categories set to false
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as { [key: string]: boolean });

      // Only set the clicked category to true if it wasn't already open
      newState[category] = !prev[category];
      return newState;
    });
  };

  // Mobile bottom navigation
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#CBD5E1] z-50">
        <div className="flex justify-around items-center p-3">
          {navigationLinks.map((category, index) => (
            <div key={index} className="relative group">
              <div
                className="flex flex-col items-center"
                onClick={() => toggleCategory(category.category)}
              >
                <Image
                  src={category.icon}
                  alt={category.category}
                  width={24}
                  height={24}
                  className="w-6 h-6 mb-1"
                />
                <span className="text-xs text-[#94A3B8]">
                  {category.category.split(" ")[0]}
                </span>
              </div>

              {/* Mobile dropdown (shows on tap) */}
              {openCategories[category.category] && (
                <div className="absolute bottom-16 bg-white rounded-lg shadow-lg p-2 w-36 border border-[#CBD5E1]">
                  {category.items.map((item, itemIdx) => (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      className="block py-2 px-3 text-sm text-[#64748B] hover:bg-blue-600 hover:text-white rounded-md"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <aside className="h-screen fixed left-0">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-white text-black h-screen transition-all duration-300 flex flex-col fixed lg:relative border border-[#CBD5E1]`}
      >
        {/* Toggle Button */}
        <div className="p-5 flex justify-between items-start">
          {isOpen ? (
            <div className="flex-1 my-3">
              <Image
                src={"/assets/icons/logo-2.png"}
                alt="logo"
                width={0}
                height={0}
                sizes="100vw"
                className="w-40 h-auto object-contain object-center"
              />
              <h1 className="uppercase text-[16px] font-medium tracking-wider mt-5">
                Idemeto Emediong
              </h1>
              <p className="text-[#64748B] text-[12px] tracking-wider">
                idemetoemediong@gmail.com
              </p>
              <p className="text-[#64748B] text-[12px] tracking-wider">
                09018660095
              </p>
            </div>
          ) : (
            <div className="w-10 h-10 flex px-5 items-center justify-center rounded-full bg-white border border-[#F8F9FD] font-bold">
              ID
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`ml-2 p-2 text-black rounded-lg focus:outline-none ${
              !isOpen ? "bg-blue-500 text-white" : ""
            }`}
          >
            <SidebarSimple size={22} />
          </button>
        </div>

        {/* Navigation Links with Categories */}
        <nav className="flex flex-col space-y-2 bg-white p-5 overflow-y-auto">
          {navigationLinks.map((category, categoryIndex) => (
            <div key={categoryIndex} className="relative py-2">
              {/* Category Header */}
              <div
                className="flex items-center justify-between p-3 cursor-pointer rounded-lg hover:bg-[#EEEEFE] border border-transparent hover:border-[#CBD5E1] transition-all ease-out"
                onClick={() => isOpen && toggleCategory(category.category)}
              >
                <div className="flex items-center space-x-2">
                  <Image
                    src={category.icon}
                    alt={category.category}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-center object-contain"
                  />
                  {isOpen && (
                    <span className="text-[16px] font-medium text-[#94A3B8]">
                      {category.category}
                    </span>
                  )}
                </div>

                {isOpen &&
                  (openCategories[category.category] ? (
                    <CaretDown size={16} className="text-gray-500" />
                  ) : (
                    <CaretRight size={16} className="text-gray-500" />
                  ))}
              </div>

              {/* Fixed tooltip for collapsed sidebar */}
              {!isOpen && (
                <div className="fixed left-20 ml-1 z-50">
                  <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap bg-gray-700 text-white text-sm px-3 py-2 rounded-md transition-opacity pointer-events-none">
                    {category.category}
                  </span>
                </div>
              )}

              {/* Category Sublinks */}
              <div
                className={`ml-2 space-y-1 overflow-hidden transition-all duration-300 ${
                  isOpen && openCategories[category.category]
                    ? "max-h-96"
                    : "max-h-0"
                }`}
              >
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="relative group pl-6">
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      {/* No icon for sublinks */}
                      {isOpen && (
                        <span className="text-[16px] font-medium text-[#64748B] group-hover:text-white tracking-wider">
                          {item.name}
                        </span>
                      )}
                    </Link>

                    {/* Fixed tooltip for sublinks when sidebar is collapsed */}
                    {!isOpen && (
                      <div className="fixed left-20 ml-1 z-50">
                        <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap bg-gray-700 text-white text-sm px-3 py-2 rounded-md transition-opacity pointer-events-none">
                          {item.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
