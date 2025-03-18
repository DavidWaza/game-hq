"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { postFn } from "@/lib/apiClient";
import { toast } from "sonner";
import Button from "../../components/Button";

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
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
    phone: number;
    confirm_password: string;
  }>();

  const [isVisible, setIsVisible] = useState(false);
  const [confirmIsVisible, setConfirmIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState(0);

  const switchRegistrationType = () => {
    setRegistrationType(registrationType === "email" ? "phone" : "email");
    reset();
    setPassword("");
    setConfirmPassword("");
    setStrength(0); 
  };

  // Handle Password Change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
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
    setConfirmPassword(newConfirmPassword);

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
      password: string;
    }) => postFn("api/auth/register", userData),
    onSuccess: (data) => {
      toast.success("Registration successful", data);
      setTimeout(() => {
        window.location.href = "/otp/emailOtp";
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
    <div className="w-full px-10 md:w-2/3 lg:w-1/2 m-auto my-20">
      <div className="pt-0 px-0">
        <div>
          <div className="text-center bg-[#222254] py-3 text-white text-lg">
            Register With{" "}
            {registrationType === "email" ? "Email" : "Phone Number"}
          </div>
        </div>
        <div className="px-10 space-y-5 border rounded-lg rounded-t-0">
          <div className="text-center flex flex-col space-y-2 py-4">
            <span className="text-sm text-[#64748B]">
              Fill in the required details below to complete your account <br />
              registration.
            </span>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {registrationType === "email" ? (
                <>
                  <div className="grid w-full items-center gap-1.5 !text-left">
                    <Label htmlFor="email" className="text-[#64748B]">
                      Email
                    </Label>
                    <Input type="email" id="email" {...register("email")} />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid w-full items-center gap-1.5 !text-left">
                    <Label htmlFor="phone" className="text-[#64748B]">
                      Phone Number
                    </Label>
                    <Input type="number" id="phone" {...register("phone")} />
                  </div>
                </>
              )}

              {/* password */}
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="password" className="text-[#64748B] !text-left">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    value={password}
                    type={isVisible ? "text" : "password"}
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
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
                  className="text-[#64748B] !text-left"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    value={confirmPassword}
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
                    onClick={() => setConfirmIsVisible(!confirmIsVisible)}
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

              <div className="flex items-center space-x-2 text-[#64748B]">
                <Checkbox id="terms" className="text-[#64748B]" />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to{" "}
                  <span className="text-[#1A5EFF] font-medium">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-[#1A5EFF] font-medium">
                    Privacy Policy
                  </span>
                </label>
              </div>
              <Button variant="primary">
                {registerMutation.isPending ? "Loading..." : "Create Account"}
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
              {registrationType === "email" ? "Phone Number" : "Email"}
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
          <p className="text-[#64748B] text-center">
            Already have an account?{" "}
            <span className="text-[#1A5EFF]">
              <Link href={"/auth/login"}>Log In</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
