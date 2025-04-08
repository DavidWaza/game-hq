"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, Wallet } from "lucide-react";

const settingsNavItems = [
  {
    title: "Account",
    href: "/dashboard/settings",
    icon: <User className="w-4 min-w-4 h-4" />,
  },
  {
    title: "Privacy",
    href: "/dashboard/settings/privacy",
    icon: <Shield className="w-4 min-w-4 h-4" />,
  },
  {
    title: "Wallet",
    href: "/dashboard/settings/wallet",
    icon: <Wallet className="w-4 min-w-4 h-4" />,
  },
];

function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
      <div className="py-40">
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
