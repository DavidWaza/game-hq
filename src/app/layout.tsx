"use client";
import { Inter } from "next/font/google";
import { QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";
import { queryClient } from "@/lib/QueryClient";
import { Toaster } from "sonner";
import Sidebar from "./components/dashboard/Sidebar";
import { useState } from "react";
import DashboardNavbar from "./components/dashboard/DashboardNavbar";

const inter = Inter({
  variable: "--font-inter-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname.includes("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body className={`${inter.className} antialiased`}>
          {isDashboard ? (
            <div className="flex flex-col h-screen">
              <div className="flex flex-1 bg-[#EEEEFE]">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div
                  className={`transition-all duration-300 p-0 ${
                    isSidebarOpen
                      ? "md:ml-[250px] md:w-[calc(100%-250px)]"
                      : "md:ml-[80px] md:w-[calc(100%-80px)]"
                  }`}
                >
                  <DashboardNavbar />
                  {children}
                </div>
              </div>
            </div>
          ) : (
            <>
              <Navbar />
              {children}
              <Footer />
            </>
          )}
          <Toaster richColors position="top-right" />
        </body>
      </QueryClientProvider>
    </html>
  );
}
