"use client";
import React, { useState } from "react";
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
import { DataFromLogin } from "../../../types/global";
// import ReferralCode from "./ReferralCode";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const MobileRegister = () => {
  const [registrationType] = useState<"email" | "phone">("email");
  const { login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    // reset,
    watch,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
    username: string;
    phone: number;
    confirm_password: string;
  }>();

  const password = watch("password", "");
  const confirmPassword = watch("confirm_password", "");
  const [isVisible_mobile, setIsVisible_mobile] = useState(false);
  const [confirmIsVisible_mobile, setConfirmIsVisible_mobile] = useState(false);

  // Handle Password Change
  const handlePasswordChangeMobile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = e.target.value;

    // Clear confirm password error if passwords start matching
    if (confirmPassword === newPassword) {
      clearErrors("confirm_password");
    }
  };

  // Handle Confirm Password Change
  const handleConfirmPasswordChangeMobile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;

    // Validate if passwords match
    if (newConfirmPassword !== password) {
      setError("confirm_password", { message: "Passwords do not match" });
    } else {
      clearErrors("confirm_password");
    }
  };

  const registerMutation = useMutation({
    mutationFn: (userData: {
      email?: string;
      phone?: number;
      username?: string;
      password: string;
    }) => postFn("api/auth/register", userData),
    onSuccess: async (data: DataFromLogin) => {
      toast.success("Registration Successful");
      await login(data);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    },
    onError: (error) => {
      toast.error(`Registration error ${error.message}`);
    },
  });

  // Form submission handler
  const onSubmit: SubmitHandler<{
    email?: string;
    phone?: number;
    username: string;
    password: string;
    confirm_password: string;
  }> = (formData) => {
    if (formData.password !== formData.confirm_password) {
      setError("confirm_password", { message: "Passwords do not match" });
      return;
    }
    registerMutation.mutate(formData);
  };

  return (
    <div>
      <div className="relative block md:hidden">
        <div className="bg-gradient-to-br from-[#233d4d] via-[#2c586b] to-[#101820] mx-auto flex justify-center h-full">
          <div className="grid lg:grid-cols-3">
            <div className="col-span-1">
              <h1 className="text-[#fcf8db] text-6xl py-32 px-5">
                Start your Journey...
              </h1>
            </div>
            <div className="col-span-2">
              <div className="relative z-20">
                <div className="pt-0 px-0">
                  <div className="px-5 space-y-5 border rounded-lg rounded-t-none py-3 glass-mobile overflow-hidden">
                    <div className="text-center flex flex-col space-y-2 py-4">
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        {registrationType === "email" ? (
                          <>
                            <div className="grid w-full items-center gap-1.5 !text-left">
                              <Label htmlFor="email" className="text-[#fcf8db]">
                                Email
                              </Label>
                              <Input
                                type="email"
                                id="email"
                                {...register("email")}
                                placeholder="Ex. davidwaza@gmail.com"
                              />
                            </div>
                            <div className="grid w-full items-center gap-1.5 !text-left">
                              <Label htmlFor="email" className="text-[#fcf8db]">
                                Username
                              </Label>
                              <Input
                                type="text"
                                id="username"
                                {...register("username")}
                                placeholder="david"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="grid w-full items-center gap-1.5 !text-left">
                              <Label htmlFor="phone" className="text-[#fcf8db]">
                                Phone Number
                              </Label>
                              <Input
                                type="number"
                                id="phone"
                                {...register("phone")}
                              />
                            </div>
                          </>
                        )}

                        {/* password */}
                        <div className="grid w-full items-center gap-1.5">
                          <Label
                            htmlFor="password"
                            className="text-[#fcf8db] !text-left"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              type={isVisible_mobile ? "text" : "password"}
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
                              onChange={handlePasswordChangeMobile}
                            />

                            <button
                              type="button"
                              className="absolute top-1/2 -translate-y-1/2 right-2"
                              onClick={() =>
                                setIsVisible_mobile(!isVisible_mobile)
                              }
                            >
                              {isVisible_mobile ? (
                                <Eye size={20} color="#000" />
                              ) : (
                                <EyeClosed size={20} color="#000" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="text-red-500 text-sm !text-left">
                              {errors.password.message}
                            </p>
                          )}
                        </div>

                        {/* Confirmed Passwoord */}
                        <div className="text-left w-full items-center">
                          <Label
                            htmlFor="confirm_password"
                            className="text-[#fcf8db] !text-left"
                          >
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <Input
                              type={
                                confirmIsVisible_mobile ? "text" : "password"
                              }
                              id="confirm_password"
                              {...register("confirm_password", {
                                required: "Confirm Password is required",
                              })}
                              onChange={handleConfirmPasswordChangeMobile}
                            />
                            <button
                              type="button"
                              className="absolute top-1/2 -translate-y-1/2 right-2"
                              onClick={() =>
                                setConfirmIsVisible_mobile(
                                  !confirmIsVisible_mobile
                                )
                              }
                            >
                              {confirmIsVisible_mobile ? (
                                <Eye size={20} color="#000" />
                              ) : (
                                <EyeClosed size={20} color="#000" />
                              )}
                            </button>
                          </div>
                          {errors.confirm_password && (
                            <p className="text-red-500 text-sm !text-left">
                              {errors.confirm_password.message}
                            </p>
                          )}
                        </div>

                        <Button variant="primary">
                          {registerMutation.isPending
                            ? "Loading..."
                            : "Create Account"}
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
                            alt="Google Icon"
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
                    <p className="text-[#FD8038] text-center">
                      Already have an account?{" "}
                      <span className="text-[#fcf8db]">
                        <Link href={"/auth/login"}>Log In</Link>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden">
                <Image
                  src={"/assets/register-duty.png"}
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-2/3 mr-0 ml-auto h-auto object-contain object-center absolute top-60 right-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileRegister;
