"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";

const ForgotPassword = () => {
  //   const router = useRouter();
  // const [registrationType, setRegistrationType] = useState<"email" | "phone">(
  //   "email"
  // );
  const [isLoading, setIsLoading] = useState(false);
  //   const [email, setEmail] = useState("");

  const { register, handleSubmit } = useForm<{
    email?: string;
    password: string;
    phone?: number;
  }>();

  const onSubmit: SubmitHandler<{
    email?: string;
    phone?: number;
  }> = () => {
    try {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      //   if (email) {
      //     window.location.href = "/forgot-password/set-password";
      //   }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-t-0 rounded-lg bg-white p-5 md:p-20 md:w-1/2 m-auto">
      <div className="bg-[#222254] py-4 rounded-t-lg">
        <h1 className="text-white text-center text-lg">Forgot Password</h1>
      </div>
      <div className="px-10 space-y-5 pb-5 border rounded-lg rounded-t-0">
        <div className="text-center flex flex-col space-y-2 py-4">
          <span className="text-sm text-[#64748B]">
            Enter the detail used to register your account to receive a{" "}
            <span className="font-medium">6-digit</span> reset code for your
            account
          </span>

          <form onSubmit={handleSubmit(onSubmit)} className="my-2 space-y-4 ">
            <div className="grid w-full items-center gap-1.5 mt-4 !text-left">
              <Input
                type="email"
                id="email"
                {...register("email")}
                placeholder="Email or Phone number"
              />
            </div>
            <Button variant="primary" size="md" width="full">
              {isLoading ? "Loading..." : "Send password"}
            </Button>
          </form>
        </div>
        <p className="text-[#64748B] text-center">
          Remember password?{" "}
          <span className="text-[#1A5EFF] font-medium">
            <Link href={"/auth/login"}>Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};
export default ForgotPassword;
