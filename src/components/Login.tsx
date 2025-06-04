"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { postFn } from "@/lib/apiClient";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DataFromLogin } from "../../types/global";

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    password: string;
    username: string;
  }>();

  const loginMutation = useMutation({
    mutationFn: (userData: { password: string; username: string }) =>
      postFn("api/auth/login", userData),
    onSuccess: async (data: DataFromLogin) => {
      if (data) {
        toast.success("Login Successful");
        const res = await login(data);
        if (res) {
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        } else if (res === null) {
          toast.info("Please verify your email to continue");
        }
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error(`Login Failed: ${errorMessage}`);
    },
  });

  const onSubmit: SubmitHandler<{
    password: string;
    username: string;
  }> = (formData) => {
    loginMutation.mutate(formData);
  };

  return (
    <div className="">
      <div className="">
        <div className="text-center flex flex-col space-y-2 py-4">
          <span className="font-bold text-lg text-[#334155]">
            Pick off from where you left.
          </span>
          <form onSubmit={handleSubmit(onSubmit)} className="my-2 space-y-4 ">
            <div className="grid w-full items-center gap-1.5 mt-4 !text-left">
              <div>
                <Label htmlFor="username" className="text-[#233d4d]">
                  Email address
                </Label>{" "}
                {/* Ensure htmlFor matches input id */}
                <Input
                  disabled={loginMutation.isPending}
                  type="email"
                  id="username"
                  {...register("username", { required: "Email is required" })}
                  placeholder="Ex. davidwaza@gmail.com"
                  autoComplete="username"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            {/* password */}
            <div className="grid w-full items-center gap-1.5 !text-left">
              <Label htmlFor="password" className="text-[#233d4d]">
                Password
              </Label>
              <div className="relative">
                <Input
                  disabled={loginMutation.isPending}
                  type={isVisible ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="*********"
                  autoComplete="current-password"
                />
                <button
                  disabled={loginMutation.isPending}
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
              <p className="text-[#233d4d] text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="hover:text-[#f37f2d] hover:font-bold transition-all ease-linear duration-300"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <Button
              disabled={loginMutation.isPending}
              variant="primary"
              size="sm"
              width="full"
              type="submit"
            >
              {loginMutation.isPending ? "Loading..." : "Login"}
            </Button>
          </form>
          <div className="divider py-4">
            <span>Or</span>
          </div>
          <Button
            disabled={loginMutation.isPending}
            variant="secondary"
            size="md"
            width="full"
            type="button"
            icon={
              <Image
                src={"/assets/icons/google-icons.svg"}
                alt="Google icon"
                width={20}
                height={20}
                className="w-5 h-5 object-contain object-center"
              />
            }
          >
            Register with Google
          </Button>
        </div>
        <p className="text-[#64748B] text-center">
          Do not have an account?{" "}
          <span className="text-[#f37f2d] hover:font-black font-medium p-1 transition-all ease-in-out duration-300">
            <Link href={"/auth/register"}>Register</Link>
          </span>
        </p>
      </div>
    </div>
  );
};
export default Login;
