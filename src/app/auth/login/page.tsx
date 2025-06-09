"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { postFn } from "@/lib/apiClient";
import { toast } from "sonner";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import MobileLogin from "@/app/components/MobileLogin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DataFromLogin } from "../../../../types/global";
import Google from "@/components/socials/Google";
import EmailVerificationModal from "@/app/components/Emailverification";

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (userData: LoginFormData) => postFn("api/auth/login", userData),
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
          setIsModalOpen(true);
        }
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Login failed", {
        position: "top-right",
        className: "p-4",
      });
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (formData) => {
    loginMutation.mutate(formData);
  };

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  return (
    <div>
      <div className="hidden lg:block">
        <Navbar variant="secondary" />
      </div>
      <div className="lg:hidden block">
        <Navbar variant="primary" />
      </div>
      <div className="lg:p-24 h-screen relative md:block hidden">
        <div className="card-two max-w-[1300px] bg-gradient-to-br from-[#233d4d] via-[#2c586b] to-[#101820] mx-auto flex justify-center md:h-full lg:h-[40rem]">
          <div className="grid lg:grid-cols-3">
            <div className="col-span-1">
              <h1 className="text-[#fcf8db] text-6xl py-32 px-2">
                Go pick up your dogtags
              </h1>
            </div>
            <div className="col-span-2 relative">
              <div className="absolute top-0 left-0 w-1/2 h-full">
                <div className="px-10 space-y-5 border rounded-lg rounded-t-none py-3 glass">
                  <div className="text-center flex flex-col space-y-2 py-4">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid w-full items-center gap-1.5 !text-left">
                        <Label htmlFor="username" className="text-[#fcf8db]">
                          Username
                        </Label>
                        <Input
                          id="username"
                          {...register("username", {
                            required: "Username is required",
                          })}
                          placeholder="Ex. davidwaza"
                        />
                        {errors.username && (
                          <p className="text-red-500 text-sm">
                            {errors.username.message}
                          </p>
                        )}
                      </div>
                      <div className="grid w-full items-center gap-1.5">
                        <Label
                          htmlFor="password"
                          className="text-[#fcf8db] !text-left"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            type={isVisible ? "text" : "password"}
                            id="password"
                            placeholder="******"
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 8,
                                message:
                                  "Password must be at least 8 characters",
                              },
                            })}
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 -translate-y-1/2 right-2"
                            onClick={() => setIsVisible(!isVisible)}
                          >
                            {isVisible ? (
                              <Eye size={20} color="#000" />
                            ) : (
                              <EyeClosed size={20} color="#000" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm">
                            {errors.password.message}
                          </p>
                        )}
                        <p className="text-[#233d4d] text-sm !text-left">
                          <Link
                            href="/auth/forgot-password"
                            className="hover:text-[#f37f2d] hover:font-bold transition-all ease-linear duration-300"
                          >
                            Forgot password?
                          </Link>
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        width="full"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Loading..." : "Login"}
                      </Button>
                    </form>
                    <div className="divider py-4">
                      <span>Or</span>
                    </div>
                    <Google
                      disabled={loginMutation.isPending}
                      text="Login with Google"
                    />
                  </div>
                  <p className="text-[#FD8038] text-center">
                    Don’t have an account?{" "}
                    <span className="text-[#fcf8db]">
                      <Link href="/auth/register">Register</Link>
                    </span>
                  </p>
                </div>
              </div>
              <Image
                src="/assets/mk-login.png"
                alt=""
                width={0}
                height={0}
                sizes="100vw"
                className="md:w-full lg:w-2/3 mr-0 ml-auto h-auto object-contain object-center"
              />
            </div>
          </div>
        </div>
      </div>
      <MobileLogin />
      <EmailVerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showLogin={false}
      />
    </div>
  );
};

export default Login;
