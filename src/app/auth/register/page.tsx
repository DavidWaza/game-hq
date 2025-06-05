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
import MobileRegister from "@/app/components/MobileRegister";
import { DataFromLogin } from "../../../../types/global";
import ReferralCode from "@/app/components/ReferralCode";

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
  const [registrationType] = useState<"email" | "phone">("email");
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
  const [isVisible, setIsVisible] = useState(false);
  const [confirmIsVisible, setConfirmIsVisible] = useState(false);
  const [strength, setStrength] = useState(0);
  const [openCode, setOpenCode] = useState(false);

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
    onSuccess: async (data: DataFromLogin) => {
      if (data) {
        toast.success(
          "Registration Successful! Please click on the link in your email to continue"
        );
      }
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
    <div>
      <div className="hidden lg:block">
        <Navbar variant="secondary" />
      </div>
      <div className="lg:hidden block">
        <Navbar variant="primary" />
      </div>
      <div className="lg:p-24 h-full py-10 relative md:block hidden">
        <div className="card-two max-w-[1300px] bg-gradient-to-br from-[#233d4d] via-[#2c586b] to-[#101820] mx-auto flex justify-center md:h-full lg:h-[45rem]">
          <div className="grid lg:grid-cols-3">
            <div className="col-span-1">
              <h1 className="text-[#fcf8db] text-3xl lg:text-6xl py-32 lg:px-2 px-5">
                Start your Journey...
              </h1>
            </div>
            <div className="col-span-2">
              <div className="lg:absolute">
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
                          <div className="mt-1">
                            <div
                              className={`h-2 w-full rounded ${strengthColors[strength]} transition-all duration-300`}
                            />
                            <span className="block text-right text-sm text-gray-500">
                              {strengthLabels[strength]}
                            </span>
                          </div>
                          {errors.password && (
                            <p className="text-red-500 text-sm !text-left">
                              {errors.password.message}
                            </p>
                          )}
                        </div>

                        <div className="text-left w-full items-center">
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
                        <div className="text-left text-black underline hover:no-underline transition-all ease-linear duration-300 hover:text-[#F2631F]">
                          <div onClick={() => setOpenCode(true)}>
                            Apply Referral Code
                          </div>
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
              {openCode && (
                <>
                  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md  transform transition-all duration-300 scale-100 animate-slide-in">
                      <ReferralCode />
                      <button
                        onClick={() => setOpenCode(false)}
                        className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </>
              )}
              <Image
                src={"/assets/register-duty.png"}
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
      {/* MOBILE VIEW */}
      <MobileRegister />
    </div>
  );
};

export default RegisterUser;
