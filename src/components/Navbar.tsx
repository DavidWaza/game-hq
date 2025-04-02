"use client";
import React from "react";
import Button from "@/app/components/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { BellSimple, Headset } from "@phosphor-icons/react";
import { useRouter, usePathname } from "next/navigation";
import Login from "@/components/Login";
import { useAuth } from "@/contexts/AuthContext";
import UserPopover from "@/components/UserPopover";

interface LogoVariant {
  variant: "primary" | "secondary";
  textColor?: string;
}

const Navbar: React.FC<LogoVariant> = ({ variant, textColor }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const isAuthRoute = pathname?.startsWith("/auth");

  if (variant === "primary") {
    textColor = "text-[#fcf8db]";
  } else if (variant === "secondary") {
    textColor = "text-[#233d4d] md:text-[#fcf8db] lg:text-[#233d4d]";
  }

  return (
    <div className="bg-transparent fixed w-full z-20 py-7">
      <nav className="container mx-auto px-4 flex justify-between items-center gap-3">
        <div className="hidden md:block">
          <Link href={"/"}>
            <div>
              <p className={`text-4xl font-medium ${textColor}`}>GameHQ</p>
            </div>
          </Link>
        </div>
        <div className="block md:hidden">
          <Link href={"/"}>
            <Image
              src={
                "https://res.cloudinary.com/dgbl43ljm/image/upload/v1742387812/logo-short-white_vzer05.png"
              }
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="w-20 h-10 object-contain object-center"
            />
          </Link>
        </div>
        <div className="flex items-center gap-5 relative">
          {!isAuthenticated && !isAuthRoute ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                width="half"
                onClick={() => router.push("/auth/register")}
                icon={
                  <Image
                    src={"/assets/icons/mail.svg"}
                    alt=""
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-5 h-5 object-contain object-center"
                  />
                }
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
                {/* <button
                  className="flex items-center gap-3 bg-[#f4f6f7] px-4 py-2 rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="rounded-lg bg-white border border-gray-200 px-4 py-2 text-lg font-semibold text-gray-700 min-w-[100px] text-center">
                    ₦20,000
                  </div>

                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/assets/default-av.jpg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <CaretDown
                    size={20}
                    className="text-gray-500 block md:hidden"
                  />
                </button> */}

                <div className="absolute right-0 top-12 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 p-2 md:hidden">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                        <BellSimple size={22} className="text-gray-400" />
                        <span className="text-gray-700">Notifications</span>
                      </TooltipTrigger>
                      <TooltipContent>Notification</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                        <Headset size={22} className="text-gray-400" />
                        <span className="text-gray-700">Support</span>
                      </TooltipTrigger>
                      <TooltipContent>Support</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-10 h-10 flex items-center justify-center">
                        <BellSimple
                          size={22}
                          className="text-gray-400 hover:text-blue-700"
                        />
                      </TooltipTrigger>
                      <TooltipContent>Notification</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-10 h-10 flex items-center justify-center">
                        <Headset
                          size={22}
                          className="text-gray-400 hover:text-blue-700"
                        />
                      </TooltipTrigger>
                      <TooltipContent>Support</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <UserPopover
                  gamerName="Nefario"
                  email="thenerfsenpai@gmail.com"
                />
              </>
            )
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
