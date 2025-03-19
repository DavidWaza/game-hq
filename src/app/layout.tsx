"use client";
import {  Plus_Jakarta_Sans } from "next/font/google";
import { QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";
import { queryClient } from "@/lib/QueryClient";
import { Toaster } from "sonner";
import DashboardNavbar from "./components/dashboard/DashboardNavbar";


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
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <head>{/* Add metadata, title, and links here */}</head>
      <body className={`${inter.className} antialiased`}>
        <QueryClientProvider client={queryClient}>
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
