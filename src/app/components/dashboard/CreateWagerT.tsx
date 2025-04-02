"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CaretDoubleLeft, Money } from "@phosphor-icons/react";
import { CalendarForm } from "@/app/components/dashboard/Calendar";
import Button from "@/app/components/Button";
import Time from "@/app/components/dashboard/TimePicker";
import { useRouter } from "next/navigation";

// Define types for form data
interface FormData {
  betOn: string;
  description: string;
  wagerAmount: string;
  participants: string;
  date: Date | null;
  time: string | null;
}

const CreateTournament: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();

  // Form state with TypeScript type
  const [formData, setFormData] = useState<FormData>({
    betOn: "",
    description: "",
    wagerAmount: "",
    participants: "",
    date: null,
    time: null,
  });

  // Track if current step is valid
  const [isCurrentStepValid, setIsCurrentStepValid] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Validate current step whenever form data changes
  useEffect(() => {
    if (currentStep === 1) {
      setIsCurrentStepValid(
        formData.betOn.trim() !== "" &&
          formData.description.trim() !== "" &&
          formData.wagerAmount.trim() !== ""
      );
    } else if (currentStep === 2) {
      setIsCurrentStepValid(
        formData.participants.trim() !== "" &&
          formData.date !== null &&
          formData.time !== null
      );
    }
  }, [formData, currentStep]);

  if (!isMounted) {
    return null;
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date): void => {
    setFormData({
      ...formData,
      date,
    });
  };

  const handleTimeChange = (time: string): void => {
    setFormData({
      ...formData,
      time,
    });
  };

  const handleNextStep = (e: FormEvent): void => {
    e.preventDefault();
    if (isCurrentStepValid) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, 2));
    }
  };

  const handlePrevStep = (e: FormEvent): void => {
    e.preventDefault();
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    // Process form submission
    console.log("Form submitted:", formData);
    // Add your submission logic here
  };

  return (
    <div className="">
      <div className="relative bg-black text-white p-6 bg-opacity-90 rounded-2xl shadow-lg border-4 border-[#fcf8db] w-full lg:w-[500px] grid grid-cols-1 gap-4 top-10">
        <div className="flex justify-between items-center p-5 border-none">
          <div className="justify-end">
            <p className="text-[#fcf8db] font-bold opacity-20">
              {currentStep === 1 ? "1/2" : currentStep === 2 ? "2/2" : ""}
            </p>
          </div>
        </div>
        <form className="grid gap-4 py-5 p-5 shadow-lg" onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <>
              <div className="space-y-1 items-center gap-4">
                <Label htmlFor="betOn" className="text-right">
                  Bet on
                </Label>
                <Input
                  type="text"
                  id="betOn"
                  name="betOn"
                  placeholder="ex. Fifa"
                  className="!text-white"
                  value={formData.betOn}
                  onChange={handleInputChange}
                />
              </div>

              {/* Cat */}
              <div className="space-y-1 items-center gap-4">
                <Label htmlFor="betOn" className="text-right">
                  Category
                </Label>
                <Input
                  readOnly
                  type="text"
                  id="category"
                  name="betOn"
                  className="!text-white"
                />
              </div>
              <div className="space-y-1 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Bet Description or Terms
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter the terms and necessary information of this bet"
                  className="h-20"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="wagerAmount" className="text-right">
                  Wager Amount
                </Label>
                <div className="relative w-32">
                  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <Money size={20} weight="duotone" />
                  </div>
                  <Input
                    id="wagerAmount"
                    name="wagerAmount"
                    type="text"
                    placeholder="0.00"
                    className="pl-9 w-full text-white"
                    value={formData.wagerAmount}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      // Only allow numbers and decimal point
                      const value = e.target.value;
                      if (/^(\d*\.?\d{0,2})?$/.test(value)) {
                        handleInputChange(e);
                      }
                    }}
                  />
                </div>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <div>
                <Label htmlFor="participants">Add Number of Participant</Label>
                <Input
                  type="text"
                  id="participants"
                  name="participants"
                  placeholder="ex. 20"
                  className="!text-white"
                  value={formData.participants}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <CalendarForm onDateChange={handleDateChange} />
              </div>
              <div>
                <Time onTimeChange={handleTimeChange} />
              </div>
            </>
          )}
          {currentStep === 2 ? (
            <div className="my-5 flex justify-between items-center gap-10 mt-5">
              <button
                className="p-3 border border-[] w-full rounded-xl hover:bg-[#f4f6f7] hover:text-[#202216] transition-all ease-in-out duration-500"
                onClick={handlePrevStep}
                type="button"
              >
                Prev
              </button>
              <Button
                variant="primary"
                size="md"
                disabled={!isCurrentStepValid}
                className={
                  !isCurrentStepValid ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                Create Tournament
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center gap-10 mt-5">
              <button
                className="p-3 border border-[] w-full rounded-xl hover:bg-[#f4f6f7] hover:text-[#202216] transition-all ease-in-out duration-500"
                onClick={handlePrevStep}
                type="button"
                disabled={currentStep === 1}
              >
                Prev
              </button>
              <Button
                variant="secondary"
                onClick={handleNextStep}
                disabled={!isCurrentStepValid}
                className={
                  !isCurrentStepValid ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                Next
              </Button>
            </div>
          )}
          <div
            onClick={() => router.back()}
            className="text-white text-center pt-5 flex items-center justify-center gap-3 hover:animate-bounce cursor-pointer"
          >
            <CaretDoubleLeft size={25} />
            Return Back
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournament;
