"use client";
import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import "./globals.scss";
import "./globals.css";
import { queryClient } from "@/lib/QueryClient";
import { Toaster } from "sonner";
import FullScreenLoader from "./components/dashboard/FullScreenLoader";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <head>{/* Add metadata, title, and links here */}</head>
      <body className="antialiased">
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={null}>
            <AuthProvider>
              <FullScreenLoader />

              {isDashboard ? (
                <div className="bg-[#0B0E13]">
                  <div>{children}</div>
                </div>
              ) : (
                <div className="bg-[#fcf8db]">{children}</div>
              )}

              <Toaster richColors position="top-right" />
            </AuthProvider>
          </Suspense>
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
