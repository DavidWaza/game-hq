"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/Button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { postFn } from "@/lib/apiClient";
import { toast } from "sonner";

const Login = () => {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const { register, handleSubmit } = useForm<{
    // email: string;
    password: string;
    username: string;
  }>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);
  };

  const loginMutation = useMutation({
    mutationFn: (userData: {
      // email: string;
      password: string;
      username: string;
    }) => postFn("api/auth/login", userData),
    onSuccess: (data) => {
      toast.success("Login Successful", data);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    },
    onError: (error) => {
      toast.error(`Login Failed ${error.message}`);
    },
  });

  // Form submission handler
  const onSubmit: SubmitHandler<{
    // email: string;
    password: string;
    username: string;
  }> = (formData) => {
    loginMutation.mutate(formData);
  };

  return (
    <div className="rounded-t-0 rounded-lg bg-white p-5 md:p-20 max-w-[650px] md:w-2/3 lg:w-1/2 m-auto">
      <div className="bg-[#222254] py-4 rounded-t-lg">
        <h1 className="text-white text-center text-lg">Login</h1>
      </div>
      <div className="px-10 space-y-5 pb-5 border rounded-lg rounded-t-0">
        <div className="text-center flex flex-col space-y-2 py-4">
          <span className="font-bold text-lg text-[#334155]">
            Welcome back!
          </span>
          <span className="text-sm text-[#64748B]">
            Fill in your details below to log in to your account
          </span>

          <form onSubmit={handleSubmit(onSubmit)} className="my-2 space-y-4 ">
            <div className="grid w-full items-center gap-1.5 mt-4 !text-left">
              <Input
                type="email"
                id="email"
                {...register("username")}
                placeholder="Email or Phone number"
              />
            </div>

            {/* password */}
            <div className="grid w-full items-center gap-1.5 !text-left">
              {/* <Label htmlFor="password" className="text-[#64748B]">
                Password
              </Label> */}
              <div className="relative">
                <Input
                  value={password}
                  type={isVisible ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  onChange={handleChange}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-2"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? (
                    <Eye size={20} weight="duotone" color="#000" />
                  ) : (
                    <EyeClosed size={20} weight="duotone" color="#000" />
                  )}
                </button>
              </div>
              <p className="text-[#94A3B8] text-sm">
                <Link href="/forgot-password" className="hover:text-[#1A5EFF]">
                  Forgot password?
                </Link>
              </p>
            </div>
            <Button variant="primary" size="md" width="full">
              {loginMutation.isPending ? "Loading..." : "Login"}
            </Button>
          </form>
          <div className="divider py-4">
            <span>Or</span>
          </div>
          <Button
            variant="secondary"
            size="md"
            width="full"
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
        </div>
        <p className="text-[#64748B] text-center">
          Do not have an account?{" "}
          <span className="text-[#1A5EFF] font-medium">
            <Link href={"/register"}>Register</Link>
          </span>
        </p>
      </div>
    </div>
  );
};
export default Login;
