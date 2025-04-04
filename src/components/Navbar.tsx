"use client";
import React from "react";
import Button from "../app/components/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { SignOut } from "@phosphor-icons/react";
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
  const { isAuthenticated, logout } = useAuth();

  const isAuthRoute = pathname?.startsWith("/auth");

  if (variant === "primary") {
    textColor = "text-[#fcf8db]";
  } else if (variant === "secondary") {
    textColor = "text-[#233d4d] md:text-[#fcf8db] lg:text-[#233d4d]";
  }

  return (
    <div className="bg-transparent fixed w-full z-50 py-7 md:px-10 px-3">
      <nav className="flex justify-between items-center gap-3">
        <div className="">
          <Link href={"/"}>
            <div>
              <p className={`text-2xl md:text-4xl font-medium ${textColor}`}>
                GameHQ
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-5 relative">
          {!isAuthenticated && !isAuthRoute ? (
            <>
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
            </>
          ) : (
            !isAuthRoute && (
              <>
                {/* Wallet & Avatar Button */}
                <Wallet />
                <SettingsMenu />
                <div className="hidden md:block">
                  <button className="fine-button-primary" onClick={logout}>
                    <SignOut size={25} />
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
