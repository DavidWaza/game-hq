"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, Wallet, File } from "lucide-react";
import {
  ClockCounterClockwise,
  Gavel,
  Lifebuoy,
  Prohibit,
  Wrench,
} from "@phosphor-icons/react";
import { CurrencyNgn } from "@phosphor-icons/react/dist/ssr";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const settingsNavItems = [
  {
    title: "Personal Account",
    href: "/dashboard/settings/personal-account",
    icon: <User className="w-4 min-w-4 h-4" />,
  },
  {
    title: "Account Balance",
    href: "/dashboard/settings/account",
    icon: <Wallet className="w-4 min-w-4 h-4" />,
  },
  {
    title: "Betting History",
    href: "/dashboard/settings/betting-history",
    icon: <File className="w-4 min-w-4 h-4" />,
  },
  {
    title: "Transaction History",
    href: "/dashboard/settings/transaction-history",
    icon: <ClockCounterClockwise className="w-4 min-w-4 h-4" />,
  },
  {
    title: "Security Settings",
    href: "/dashboard/settings/security-settings",
    icon: <Shield className="w-4 min-w-4 h-4" />,
  },
  {
    title: "Preferences",
    href: "/dashboard/settings/preferences",
    icon: <Wrench className="w-4 min-w-4 h-4" />,
  },
  {
    title: "Promotions and Bonuses",
    href: "/dashboard/settings/promotion-and-bonuses",
    icon: <CurrencyNgn className="w-4 min-w-4 h-4" />,
  },
  {
    title: "Responsible Gambling Tools",
    href: "/dashboard/settings/responsible-gambling-tools",
    icon: <Prohibit className="w-4 min-w-4 h-4" />,
  },
  {
    title: "Support & Help",
    href: "/dashboard/settings/support-and-help",
    icon: <Lifebuoy className="w-4 min-w-4 h-4" />,
  },
  {
    title: "Legal & Compliance",
    href: "/dashboard/settings/legal-and-compliance",
    icon: <Gavel className="w-4 min-w-4 h-4" />,
  },
];

function SettingsNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Scroll by a fixed amount
  const scrollLeft = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Monitor scroll position to toggle arrow visibility
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 for precision
      }
    };

    const navElement = navRef.current;
    navElement?.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => navElement?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#233d4d] text-[#f37f2d] p-2 rounded-full hover:bg-[#2e4a5e] transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Navigation Bar */}
      <nav
        ref={navRef}
        className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2"
      >
        {settingsNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm flex items-center gap-2 px-4 py-2 rounded-md transition-colors whitespace-normal min-w-max sheen !translate-y-0 ${
              pathname === item.href
                ? "bg-[#233d4d] text-[#f37f2d] active"
                : "text-gray-300 hover:bg-[#233d4d] hover:text-[#f37f2d]"
            }`}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#233d4d] text-[#f37f2d] p-2 rounded-full hover:bg-[#2e4a5e] transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar variant="primary" />
      <div className="py-28">
        <div className="container mx-auto p-4">
          <div className="space-y-6">
            {/* Settings Navigation Bar */}
            <div className="bg-[#1a1f2e] rounded-lg p-4">
              <SettingsNav />
            </div>

            {/* Main Content Area */}
            <div>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}