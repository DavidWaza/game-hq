"use client";
import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Button from "@/app/components/Button";
import { useForm } from "react-hook-form";
import Link from "next/link";

const EmailOtp = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {  handleSubmit, setValue, watch } = useForm<{
    otp: string[];
  }>({
    defaultValues: { otp: ["", "", "", "", "", ""] }, // Ensure default values
  });

  const otpValues = watch("otp");

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1); // Allow only one digit per box
    setValue("otp", newOtp);
  };

  const onSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (otpValues.join("").length === 6) {
        window.location.href = "/otp/otp-confirm";
      } else {
        alert("Invalid OTP, please enter a 6-digit code.");
      }
    }, 3000);
  };

  return (
    <div className="rounded-t-0 rounded-lg bg-white p-5 md:p-20 md:w-1/2 m-auto">
      <div className="bg-[#222254] py-4 rounded-t-lg">
        <h1 className="text-white text-center text-lg">Email Verification</h1>
      </div>
      <div className="bg-neutral-50 shadow-md border border-neutral-100 h-1/2 p-10 flex flex-col justify-center">
        <p className="text-center text-[#64748B]">
          Enter the <span className="font-semibold">6-digit</span> code sent to
          your email <span className="font-semibold">BodeTope@email.com</span>{" "}
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-1/2 m-auto space-y-7 my-4"
        >
          <InputOTP maxLength={6}>
            <InputOTPGroup className="space-x-3">
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  // value={otpValues[index] || ""}
                  onChange={(e) => handleChange(index, (e.target as HTMLInputElement).value)}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <Button variant="primary" size="sm" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          <p className="text-[#64748B] text-sm text-center">
            Didn’t receive a code?
          </p>
          <p className="text-[#64748B] text-sm text-center">
            <span className="text-[#1A5EFF] font-medium">
              <Link href="#">Resend</Link>
            </span>{" "}
            or{" "}
            <span className="text-[#1A5EFF] font-medium">
              <Link href="#">Change Email Address</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};
export default EmailOtp;
