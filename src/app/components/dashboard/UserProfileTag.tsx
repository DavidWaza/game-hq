import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

const MilitaryDogTag = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex justify-end p-4">
      <div className="relative" ref={dropdownRef}>
        {/* Dog Tag Container */}
        <div className="relative bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg max-w-xs shadow-lg hover:shadow-xl transition-all duration-300 overflow-visible">
          {/* The hole in the dog tag */}
          <div className="absolute top-3 left-3 w-4 h-4 bg-gray-900 rounded-full border-2 border-gray-500"></div>

          {/* Tag Contents */}
          <div className="pt-3 pb-3 pl-10 pr-4 flex flex-col">
            {/* Avatar placed to the right side */}
            <div className="absolute right-3 top-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-500 shadow-md hidden lg:block">
                <Image
                  src="/assets/default-av.jpg"
                  alt="User Avatar"
                  width={0}
                  height={0}
                  className="w-full h-full object-cover"
                />
                {/* Notification Badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
              </div>
            </div>

            {/* Dog Tag Info - Embossed/stamped text style */}
            <div className="font-mono text-sm text-gray-700 tracking-wider space-y-1">
              <div className="uppercase font-bold">CALLAHAN R.</div>
              <div>991357342</div>
              <div className="flex items-center">
                <span className="uppercase mr-2">CREDITS:</span>
                <span className="font-bold text-xs lg:text-lg whitespace-nowrap">2,500 CP</span>
              </div>
              <div className="uppercase">PREMIUM</div>
            </div>

            {/* Dropdown Toggle */}
            <button
              className="absolute z-50 bottom-3 right-3 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              onClick={toggleDropdown}
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Chain */}
          <div className="absolute -top-6 left-5 w-1 h-6 bg-gradient-to-b from-transparent to-gray-500"></div>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10 overflow-visible transition-all duration-200 ${
              isOpen
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 invisible transform -translate-y-2"
            }`}
          >
            <div className="py-1">
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Notifications
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Settings
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Account Balance
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                </svg>
                Purchase History
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilitaryDogTag;
