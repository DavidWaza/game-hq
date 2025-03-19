"use client";
import { useState, useEffect, useTransition } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { queryClient } from "@/lib/QueryClient";
import { Toaster } from "sonner";
import DashboardNavbar from "./components/dashboard/DashboardNavbar";
import FullScreenLoader from "./components/dashboard/FullScreenLoader";

const inter = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
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

  const [, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setIsLoading(true); // Show loader immediately on navigation
      setTimeout(() => {
        setIsLoading(false); // Keep loader visible for at least 1 second
      }, 1000);
    });
  }, [pathname]);

  return (
    <html lang="en">
      <head>{/* Add metadata, title, and links here */}</head>
      <body className={`${inter.className} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <FullScreenLoader isLoading={isLoading} />
          {isDashboard ? (
            <>
              <DashboardNavbar />
              {children}
            </>
          ) : (
            <>
              <Navbar />
              {children}
              <Footer />
            </>
          )}

          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
