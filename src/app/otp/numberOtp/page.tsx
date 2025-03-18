import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Button from "@/app/components/Button";
import Link from "next/link";

const PhoneOtp = () => {
  return (
    <div className="rounded-t-0 rounded-lg bg-white p-5 md:p-20 md:w-1/2 m-auto">
      <div className="bg-[#222254] py-4 rounded-t-lg">
        <h1 className="text-white text-center text-lg">Phone Verification</h1>
      </div>
      <div className="bg-neutral-50 shadow-md border border-neutral-100 h-1/2 p-10 flex flex-col justify-center">
        <p className="text-center text-[#64748B]">
          Enter the <span className="font-semibold">6-digit</span> code sent to
          your email <span className="font-semibold">090********75</span>{" "}
        </p>
        <div className="w-1/2 m-auto space-y-7 my-4">
          <InputOTP maxLength={6}>
            <InputOTPGroup className="space-x-3">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button variant="primary" size="sm">
            Verify Phone Number
          </Button>
          <p className="text-[#64748B] text-sm text-center">
            Didn’t receive a code?
          </p>
          <p className="text-[#64748B] text-sm text-center">
            <span className="text-[#1A5EFF] font-medium">
              <Link href={"#"}>Resend</Link>
            </span>{" "}
            or{" "}
            <span className="text-[#1A5EFF] font-medium">
              <Link href={"#"}>Change Phone Number</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default PhoneOtp;
