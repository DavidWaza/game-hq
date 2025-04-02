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
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { login } = useAuth();
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
    onSuccess: async (data) => {
      if (data?.token) {
        toast.success("Login Successful");
        await login(data?.token);
      }
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
    <div className="">
      <div className="">
        <div className="text-center flex flex-col space-y-2 py-4">
          <span className="font-bold text-lg text-[#334155]">
            Pick off from where you left.
          </span>
          <form onSubmit={handleSubmit(onSubmit)} className="my-2 space-y-4 ">
            <div className="grid w-full items-center gap-1.5 mt-4 !text-left">
              <div>
                <Label className="text-[#233d4d]">Email address</Label>
                <Input
                  disabled={loginMutation.isPending}
                  type="email"
                  id="email"
                  {...register("username")}
                  placeholder="Ex. davidwaza@gmail.com"
                />
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
                  value={password}
                  type={isVisible ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  onChange={handleChange}
                  placeholder="*********"
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
              <p className="text-[#233d4d] text-sm">
                <Link
                  href="/forgot-password"
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
          <span className="text-[#f37f2d] hover:font-black font-medium p-1 transition-all ease-in-out duration-300">
            <Link
              href={"/auth/register"}
              onClick={() => (window.location.href = "/auth/register")}
            >
              Register
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};
export default Login;
