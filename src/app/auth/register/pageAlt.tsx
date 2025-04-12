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
import Navbar from "@/components/Navbar";
import MobileRegister from "@/app/components/MobileRegisterAlt";

const evaluateStrength = (password: string) => {
  const lengthCriteria = password.length >= 8;
  const lowercaseCriteria = /[a-z]/.test(password);
  const uppercaseCriteria = /[A-Z]/.test(password);
  const numberCriteria = /\d/.test(password);
  const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let strength = 0;
  if (lengthCriteria) strength++;
  if (lowercaseCriteria) strength++;
  if (uppercaseCriteria) strength++;
  if (numberCriteria) strength++;
  if (specialCharCriteria) strength++;

  return strength;
};

const RegisterUser: React.FC = () => {
  const [registrationType, setRegistrationType] = useState<"email" | "phone">(
    "email"
  );
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
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
  const [isVisible, setIsVisible] = useState(false);
  const [confirmIsVisible, setConfirmIsVisible] = useState(false);
  const [strength, setStrength] = useState(0);

  const switchRegistrationType = () => {
    setRegistrationType(registrationType === "email" ? "phone" : "email");
    reset();
    setStrength(0);
  };

  // Handle Password Change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setStrength(evaluateStrength(newPassword));

    // Clear confirm password error if passwords start matching
    if (confirmPassword === newPassword) {
      clearErrors("confirm_password");
    }
  };

  // Handle Confirm Password Change
  const handleConfirmPasswordChange = (
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
    onSuccess: () => {
      setTimeout(() => {
        window.location.href = "/dashboard/splash-avatar";
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
    password: string;
    confirm_password: string;
  }> = (formData) => {
    if (formData.password !== formData.confirm_password) {
      setError("confirm_password", { message: "Passwords do not match" });
      return;
    }
    registerMutation.mutate(formData);
  };

  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-teal-500",
  ];

  return (
    <>
      <div className="lg:p-24 h-screen relative md:flex hidden justify-center items-center">
        <Navbar variant="secondary" />
        <div className="card-two max-w-[1300px] bg-gradient-to-br from-[#233d4d] via-[#2c586b] to-[#101820] mx-auto flex justify-center w-full overflow-hidden">
          <div className="flex justify-center items-center">
            <div className="transLeftLonger absolute left-4 top-32 max-w-[400px]">
              <h1 className="text-[#fcf8db] text-6xl">Start your Journey...</h1>
            </div>
            <div className="relative z-10">
              <div className="max-w-max">
                <div className="pt-0 px-0">
                  <div className="px-10 space-y-5 border rounded-lg rounded-t-none py-3 glass">
                    <div className="text-center flex flex-col space-y-2 py-4">
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        {registrationType === "email" ? (
                          <>
                            <div className="grid w-full items-center gap-1.5 !text-left">
                              <Label htmlFor="email" className="text-[#fcf8db]">
                                Email Address
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
                                placeholder="david waza"
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
                              onChange={handlePasswordChange}
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
                          <div className="mt-2">
                            <div
                              className={`h-2 w-full rounded ${strengthColors[strength]} transition-all duration-300`}
                            />
                            <span className="block text-right text-sm text-gray-500 mt-1">
                              {strengthLabels[strength]}
                            </span>
                          </div>
                          {errors.password && (
                            <p className="text-red-500 text-sm !text-left">
                              {errors.password.message}
                            </p>
                          )}
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                          <Label
                            htmlFor="confirm_password"
                            className="text-[#fcf8db] !text-left"
                          >
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <Input
                              type={confirmIsVisible ? "text" : "password"}
                              id="confirm_password"
                              {...register("confirm_password", {
                                required: "Confirm Password is required",
                              })}
                              onChange={handleConfirmPasswordChange}
                            />
                            <button
                              type="button"
                              className="absolute top-1/2 -translate-y-1/2 right-2"
                              onClick={() =>
                                setConfirmIsVisible(!confirmIsVisible)
                              }
                            >
                              {confirmIsVisible ? (
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
                        onClick={switchRegistrationType}
                        icon={
                          <Image
                            src={"/assets/icons/mail.svg"}
                            alt="Email Icon"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-5 h-5 object-contain object-center"
                          />
                        }
                      >
                        Register with{" "}
                        {registrationType === "email"
                          ? "Phone Number"
                          : "Email"}
                      </Button>
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
            </div>
            <Image
              src={"/assets/register-duty.png"}
              alt=""
              width={0}
              height={0}
              className="transRightLonger w-full max-w-[500px] absolute right-2 -bottom-6 h-full object-contain object-center"
            />
          </div>
        </div>
      </div>
      {/* MOBILE VIEW */}
      <MobileRegister />
    </>
  );
};

export default RegisterUser;
