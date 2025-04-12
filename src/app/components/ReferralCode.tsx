"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/Button";

interface ForgotPasswordAuth {
  referralCode: string;
}

const ReferralCode = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  
  } = useForm<ForgotPasswordAuth>({
    mode: "onChange",
    defaultValues: {
      referralCode: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordAuth> = (formData) => {
    console.log(formData);
  };

 

  return (
    <div className="w-full bg-[#1a1f2e] rounded-lg p-7">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Old newpassword */}
        <div className="grid w-full items-center gap-1.5 !text-left">
          <Label htmlFor="referralCode" className="text-[#fcf8db]">
            Referral Code
          </Label>
          <Input
            id="referralCode"
            {...register("referralCode", {
            })}
            placeholder="Insert Refferal Code"
          />
          {errors.referralCode && (
            <p className="text-red-500 text-sm">{errors.referralCode.message}</p>
          )}
        </div>

        <Button
          variant="primary"
          size="sm"
          width="full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Confirm Code"}
        </Button>
      </form>
    </div>
  );
};

export default ReferralCode;
