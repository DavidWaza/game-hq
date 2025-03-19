"use client";
import React, { useState } from "react";
import Button from "./Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import RegistrationForm from "./RegistrationForm";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [openCreateAccount, setOpenCreateAccount] = useState(false);
  const [registrationType, setRegistrationType] = useState<"email" | "phone">(
    "email"
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [openAgeConfirmation, setOpenAgeConfirmation] = useState(false);

  const switchRegistrationType = () => {
    setRegistrationType(registrationType === "email" ? "phone" : "email");
  };

  return (
    <div className="bg-[#222254] py-7 px-10 ">
      <nav className="flex justify-between items-center gap-3">
        <div className="hidden md:block">
          <Link href={"/"}>
            <Image
              src={"/assets/icons/logo.png"}
              alt=""
              width={150}
              height={150}
              sizes="100vw"
              // className="w-0 h-0 object-contain object-center"
            />
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
        <div className="flex items-center gap-3">
          {/* First Modal (Age Confirmation) */}
          <Dialog
            open={openAgeConfirmation}
            onOpenChange={setOpenAgeConfirmation}
          >
            <DialogTrigger className="bg-transparent border border-[#1A5EFF] hover:bg-[#1A5EFF] px-6 py-2 text-base rounded-lg text-white transition-all duration-500 ease-in-out">
              Register
            </DialogTrigger>
            <DialogContent className="pt-0 px-0">
              <DialogHeader>
                <DialogTitle className="text-center bg-[#222254] py-3 !text-white text-lg">
                  Age Confirmation
                </DialogTitle>
              </DialogHeader>
              <div className="px-10 space-y-5">
                <DialogDescription className="text-center py-4">
                  By continuing, you confirm that you are at least{" "}
                  <span className="font-bold">18 years</span> old and legally
                  eligible to proceed.
                </DialogDescription>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setOpenCreateAccount(true);
                    setOpenAgeConfirmation(false);
                  }}
                >
                  Create Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Second Modal (Create Account) */}
          <Dialog open={openCreateAccount} onOpenChange={setOpenCreateAccount}>
            <DialogContent className="pt-0 px-0">
              <DialogHeader>
                <DialogTitle className="text-center bg-[#222254] py-3 text-white text-lg">
                  Register
                </DialogTitle>
              </DialogHeader>
              <div className="px-10 space-y-5">
                <DialogDescription className="text-center flex flex-col space-y-2 py-4">
                  <span className="font-bold text-lg text-black">
                    Welcome to GameHQ!
                  </span>
                  <span className="text-sm"></span>
                  <Button
                    variant="secondary"
                    size="md"
                    width="full"
                    onClick={() => {
                      setRegistrationType("phone");
                      setOpenDialog(true);
                      setOpenCreateAccount(false);
                    }}
                    icon={
                      <Image
                        src={"/assets/icons/phone.svg"}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-5 h-5 object-contain object-center"
                      />
                    }
                  >
                    Register with Phone Number
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    width="full"
                    onClick={() => setOpenCreateAccount(false)}
                    icon={
                      <Image
                        src={"/assets/icons/google-icons.svg"}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-5 h-5 object-contain object-center"
                      />
                    }
                  >
                    Register with Google
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    width="full"
                    onClick={() => {
                      setRegistrationType("email");
                      setOpenDialog(true);
                      setOpenCreateAccount(false);
                    }}
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
                    Register with Email
                  </Button>
                </DialogDescription>
                <p className="text-[#64748B] text-center">
                  Already have an account?{" "}
                  <span className="text-[#1A5EFF]">
                    {/* {window.location.href = '/login'} */}
                    <button
                      onClick={() => (window.location.href = "/auth/login")}
                    >
                      Login
                    </button>
                  </span>
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {registrationType && (
            <RegistrationForm
              openDialog={openDialog}
              onDialogChange={setOpenDialog}
              registrationType={registrationType}
              switchRegistrationType={switchRegistrationType}
            />
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
