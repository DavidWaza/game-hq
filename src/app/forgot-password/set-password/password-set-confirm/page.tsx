"use client";
import React from "react";
import Image from "next/image";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";

const PasswordSetConfirmation = () => {
  const router = useRouter();
  return (
    <div className="rounded-t-0 rounded-lg bg-white p-5 md:p-20 md:w-1/2 m-auto">
      <div className="bg-[#222254] py-4 rounded-t-lg">
        <h1 className="text-white text-center text-lg">Account Created</h1>
      </div>
      <div className="bg-neutral-50 shadow-md border border-neutral-100 h-1/2 p-10 flex flex-col justify-center">
        <Image
          src={"/assets/icons/Check.svg"}
          alt="Account Created"
          sizes="100vw"
          width={0}
          height={0}
          className="w-12 h-12 md:w-28 md:h-28 m-auto"
        />
        <p className="text-center font-semibold my-3 text-xl md:text-4xl text-[#334155]">
          Congratulations
        </p>
        <p className="text-center text-sm md:text-lg text-[#334155]">
          Your account&apos;s password has been successfully reset
        </p>
        <div className="my-6">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              router.push("/auth/login");
            }}
          >
            Continue to Login
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PasswordSetConfirmation;
