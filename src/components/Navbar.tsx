"use client";
import React, { useState, useEffect } from "react";
import Button from "./Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Login from "@/components/Login";
import { useAuth } from "@/contexts/AuthContext";
import Wallet from "@/app/components/dashboard/Wallet";
import SettingsMenu from "@/app/components/dashboard/SettingsMenu";

interface LogoVariant {
  variant: "primary" | "secondary";
  textColor?: string;
}

const Navbar: React.FC<LogoVariant> = ({ variant, textColor }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthRoute = pathname?.startsWith("/auth");

  if (variant === "primary") {
    textColor = "text-[#fcf8db]";
  } else if (variant === "secondary") {
    textColor = "text-[#233d4d] md:text-[#fcf8db] lg:text-[#233d4d]";
  }

  return (
    <div
      className={`fixed w-full z-50 py-7 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0B0E13]/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="flex justify-between items-center gap-3 px-4 mx-auto container">
        <div className="">
          <Link href={"/"} className="!outline-none !border-none">
            <div>
              <p className={`text-2xl md:text-4xl font-medium ${textColor}`}>
                GameHQ
              </p>
            </div>
          </Link>
        </div>

        <div>
          {isAuthenticated !== undefined && (
            <>
              {!isAuthenticated && !isAuthRoute ? (
                <>
                  <div className="lg:flex items-center gap-5 relative transLeft hidden">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => router.push("/auth/register")}
                    >
                      Create Account
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="primary" size="sm">
                          Login
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        style={{ borderRadius: "24px" }}
                        aria-describedby="login-dialog-description"
                        className="sm:max-w-[425px]"
                      >
                        <DialogHeader>
                          <DialogTitle className="">LOGIN</DialogTitle>
                        </DialogHeader>
                        <Login />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="lg:hidden flex gap-5 underline">
                    <Link
                      href={"/auth/register"}
                      className="text-white hover:scale-50 transition-all ease-in-out"
                    >
                      Create Account
                    </Link>
                    <Link href={"/auth/login"} className="text-[#f37f2d]">
                      Login
                    </Link>
                  </div>
                </>
              ) : (
                !isAuthRoute && (
                  <div className="flex items-center gap-5 relative transLeft">
                    {/* Wallet & Avatar Button */}
                    <Wallet />
                    <SettingsMenu />
                  </div>
                )
              )}
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
