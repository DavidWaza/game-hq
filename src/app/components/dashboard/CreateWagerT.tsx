"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CaretDoubleLeft, Money } from "@phosphor-icons/react";
import { CalendarForm } from "@/app/components/dashboard/Calendar";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { getFn, postFn } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventScheduler from "./TimerSchedule";

// Define types
interface FormData {
  category_id: string;
  bet_on: string;
  description: string;
  amount: string;
  number_of_participants: number;
  created_at: Date | null;
  match_time: string;
}

const CreateTournament: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { store } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isLoading },
    setValue,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      category_id: "",
      bet_on: "",
      description: "",
      amount: "",
      number_of_participants: 0,
      created_at: null,
      match_time: "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCategoryChange = (value: string) => {
    setValue("category_id", value, { shouldValidate: true });
  };

  const handleDateChange = (created_at: Date): void => {
    setValue("created_at", created_at, { shouldValidate: true });
  };

  const handleTimeChange = (match_time: string): void => {
    setValue("match_time", match_time, { shouldValidate: true });
  };

  const handleNextStep = (): void => {
    if (isValid && !isLoading) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, 2));
    }
  };

  const handlePrevStep = (): void => {
    if (!isLoading) {
      setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await postFn("api/tournamentstables/add", data);
      toast.success("Tournament Created Successfully", {
        position: "top-right",
        className: "p-4",
      });
      router.push("/dashboard/join-tournament");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again", {
        position: "top-right",
        className: "p-4",
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative bg-black text-white p-6 bg-opacity-90 rounded-2xl shadow-lg border-4 border-[#fcf8db] w-[500px] max-w-[500px] grid grid-cols-1 gap-4">
        <div className="flex justify-between items-center p-5 border-none">
          <div className="justify-end">
            <p className="text-[#fcf8db] font-bold opacity-20">
              {currentStep}/2
            </p>
          </div>
        </div>
        <form
          className="grid gap-4 py-5 p-5 shadow-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          {currentStep === 1 && (
            <>
              <div className="space-y-1">
                <Label>Game Category</Label>
                <Select
                  onValueChange={handleCategoryChange}
                  {...register("category_id", {
                    required: "Game category is required",
                  })}
                >
                  <SelectTrigger className="w-full text-white">
                    <SelectValue placeholder="Select game category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {store?.categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <p className="text-red-500 text-sm">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="bet_on">Bet On</Label>
                <Input
                  {...register("bet_on", {
                    required: "Select game is required",
                  })}
                  id="bet_on"
                  placeholder="ex. Fifa 25"
                  className="!text-white"
                  disabled={isValid}
                />
                {errors.bet_on && (
                  <p className="text-red-500 text-sm">
                    {errors.bet_on.message}
                  </p>
                )}
              </div>

              <div className="space-y-1 items-center gap-4">
                <Label htmlFor="description">Note to Participants</Label>
                <Textarea
                  {...register("description", {
                    required: "Note description is required",
                  })}
                  id="description"
                  placeholder="Enter the terms and necessary information of this bet"
                  className="h-20"
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="amount">Wager Amount</Label>
                <div className="relative w-32">
                  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <Money size={20} weight="duotone" />
                  </div>
                  <Input
                    {...register("amount", {
                      required: "Amount is required",
                      pattern: {
                        value: /^\d*\.?\d{0,2}$/,
                        message: "Invalid amount format",
                      },
                    })}
                    id="amount"
                    placeholder="0.00"
                    className="pl-9 w-full text-white"
                    disabled={isLoading}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <div>
                <Label htmlFor="number_of_participants">
                  Number of Participants
                </Label>
                <Input
                  {...register("number_of_participants", {
                    required: "Number of participants is required",
                    min: { value: 1, message: "Must be at least 1" },
                  })}
                  type="number"
                  id="number_of_participants"
                  placeholder="ex. 20"
                  className="!text-white"
                  disabled={isLoading}
                />
                {errors.number_of_participants && (
                  <p className="text-red-500 text-sm">
                    {errors.number_of_participants.message}
                  </p>
                )}
              </div>
              <div>
                <CalendarForm
                  onDateChange={handleDateChange}
                  {...register("created_at", {
                    required: "Date is required",
                  })}
                />
                {errors.created_at && (
                  <p className="text-red-500 text-sm">
                    {errors.created_at.message}
                  </p>
                )}
              </div>
              <div>
                <EventScheduler
                  onTimeChange={handleTimeChange}
                  {...register("match_time", {
                    required: "Match time is required",
                  })}
                />

                {errors.match_time && (
                  <p className="text-red-500 text-sm">
                    {errors.match_time.message}
                  </p>
                )}
              </div>
            </>
          )}
          <div className="flex justify-between items-center gap-10 mt-5">
            <button
              type="button"
              className="p-3 border w-full rounded-xl hover:bg-[#f4f6f7] hover:text-[#202216] transition-all ease-in-out duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isLoading}
            >
              Prev
            </button>
            {currentStep === 2 ? (
              <Button
                variant="primary"
                size="md"
                // disabled={!isValid || isLoading}
              >
                {isLoading ? "Creating..." : "Create Tournament"}
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={handleNextStep}
                disabled={!isValid || isLoading}
                type="button"
                className={
                  !isValid || isLoading ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                Next
              </Button>
            )}
          </div>
          <div
            onClick={() => !isLoading && router.back()}
            className={`text-white text-center pt-5 flex items-center justify-center gap-3 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:animate-bounce cursor-pointer"
            }`}
          >
            <CaretDoubleLeft size={25} />
            Back
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournament;
