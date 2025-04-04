"use client";
import { useState, useEffect, useTransition } from "react";
import { Russo_One } from "next/font/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import "./globals.scss";
import "./globals.css";
import { queryClient } from "@/lib/QueryClient";
import { Toaster } from "sonner";
import FullScreenLoader from "./components/dashboard/FullScreenLoader";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Russo_One({
  variable: "--Russo_One",
  display: "swap",
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

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
      <body className={`${inter.className} antialiased bg-[#0B0E13]`}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <FullScreenLoader isLoading={isLoading} />
          <AuthProvider>
            <FullScreenLoader isLoading={isLoading} />

            {isDashboard ? (
              <div className="bg-[#0B0E13]">
                <div>{children}</div>
              </div>
            ) : (
              <div className="bg-[#fcf8db]">{children}</div>
            )}

            <Toaster richColors position="top-right" />
          </AuthProvider>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
