"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/Button";
import { CalendarForm } from "@/app/components/dashboard/Calendar";

interface AccountDetailsData {
  username: string;
  fullname: string;
  email: string;
  phonenumber: string;
  dob: Date;
}

const AccountForms = () => {
  const { setValue } = useForm<AccountDetailsData>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountDetailsData>({
    mode: "onChange",
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      phonenumber: "",
    },
  });

  const onSubmit: SubmitHandler<AccountDetailsData> = (formData) => {
    console.log(formData);
  };

  const handleDateChange = (dob: Date): void => {
    setValue("dob", dob, { shouldValidate: true });
  };

  return (
    <div className="w-full lg:w-[70%] bg-[#1a1f2e] rounded-lg p-7">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
     

        {/* Fullname */}
        <div className="grid w-full items-center gap-1.5 !text-left">
          <Label htmlFor="fullname" className="text-[#fcf8db]">
            FullName
          </Label>
          <Input
            id="fullname"
            className="text-white"
            {...register("fullname", {
              required: "FullName is required",
            })}
            placeholder="Ex. David Waza"
          />
          {errors.fullname && (
            <p className="text-red-500 text-sm">{errors.fullname.message}</p>
          )}
        </div>
        {/* Phone Number */}
        <div className="grid w-full items-center gap-1.5 !text-left">
          <Label htmlFor="phonenumber" className="text-[#fcf8db]">
            Phone Number
          </Label>
          <Input
            id="phonenumber"
            className="text-white"
            {...register("phonenumber", {
              required: "Phone Number is required",
            })}
            placeholder="Ex. +234 *** *** ***7"
          />
          {errors.phonenumber && (
            <p className="text-red-500 text-sm">{errors.phonenumber.message}</p>
          )}
        </div>

        {/* Date of birth */}
        <div>
          <CalendarForm
            onDateChange={handleDateChange}
            {...register("dob", {
              required: "Date is required",
            })}
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          width="full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default AccountForms;
