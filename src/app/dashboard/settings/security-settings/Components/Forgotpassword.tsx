"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/Button";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import { postFn } from "@/lib/apiClient";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ForgotPasswordAuth {
  oldpassword: string;
  newpassword: string;
  confirmpassword: string;
}

const ForgotPassword = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [confirmIsVisible, setConfirmIsVisible] = useState(false);
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    clearErrors,
    getValues,
  } = useForm<ForgotPasswordAuth>({
    mode: "onChange",
    defaultValues: {
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordAuth> = async (formData) => {
    setIsLoading(true);
    try {
      const response = await postFn(`api/account/changepassword`, formData);
      if (response) {
        toast.success(
          "Pasword change succesfully! Please login into the account with your new password!",
          {
            position: "top-right",
            className: "p-4",
          }
        );
        logout();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again", {
        position: "top-right",
        className: "p-4",
      });
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;

    // Clear confirm password error if passwords start matching
    const confirmpassword = getValues("confirmpassword");
    if (confirmpassword === newPassword) {
      clearErrors("confirmpassword");
    }
  };

  // Handle Confirm Password Change
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;

    // Validate if passwords match
    const newpassword = getValues("newpassword");
    if (newConfirmPassword !== newpassword) {
      setError("confirmpassword", { message: "Passwords do not match" });
    } else {
      clearErrors("confirmpassword");
    }
  };

  return (
    <div className="w-full bg-[#1a1f2e] rounded-lg p-7">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Old newpassword */}
        <div className="grid w-full items-center gap-1.5 !text-left">
          <Label htmlFor="oldpassword" className="text-[#fcf8db]">
            Old Password
          </Label>
          <Input
            disabled={isLoading}
            id="oldpassword"
            {...register("oldpassword", {
              required: "Old password is required",
            })}
            placeholder="Insert Old Password"
          />
          {errors.oldpassword && (
            <p className="text-red-500 text-sm">{errors.oldpassword.message}</p>
          )}
        </div>

        {/* password */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="newpassword" className="text-[#fcf8db] !text-left">
            Password
          </Label>
          <div className="relative">
            <Input
              disabled={isLoading}
              type={isVisible ? "text" : "password"}
              id="newpassword"
              placeholder="******"
              {...register("newpassword", {
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

          {errors.newpassword && (
            <p className="text-red-500 text-sm !text-left">
              {errors.newpassword.message}
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
              disabled={isLoading}
              type={confirmIsVisible ? "text" : "password"}
              id="confirm_password"
              {...register("confirmpassword", {
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
          {errors.confirmpassword && (
            <p className="text-red-500 text-sm !text-left">
              {errors.confirmpassword.message}
            </p>
          )}
        </div>

        <Button
          className="!mt-12"
          variant="primary"
          size="sm"
          width="full"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? "Loading..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
