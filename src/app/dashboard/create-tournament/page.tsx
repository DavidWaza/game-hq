"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Money } from "@phosphor-icons/react";
import { CalendarForm } from "@/app/components/dashboard/Calendar";
import Button from "@/app/components/Button";
import Time from "@/app/components/dashboard/TimePicker";
import DashboardNavbar from "@/app/components/dashboard/DashboardNavbar";

const CreateTournament = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 2));
  };

  const handlePrevStep = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <div className='bg-[#fffdf6] h-screen'>
      <DashboardNavbar bgColor={"!bg-white"} />
      <div className="rounded-t-0 rounded-lg p-5 md:p-20 max-w-[650px] md:w-2/3 lg:w-1/2 m-auto relative top-24">
        <div className="bg-[#222254] py-4 rounded-t-lg">
          <h1 className="text-white text-center text-lg">Create Tournament</h1>
        </div>
        <div className="flex justify-between items-center bg-white p-5 border-none">
          <div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Category</SelectLabel>
                  <SelectItem value="apple">iMessage Games</SelectItem>
                  <SelectItem value="banana">PlayStation Games</SelectItem>
                  <SelectItem value="blueberry">Sport Betting</SelectItem>
                  <SelectItem value="grapes">Entertainment</SelectItem>
                  <SelectItem value="pineapple">
                    Fantasy Premier League (FPL)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-[#817504] font-bold opacity-20">
              {currentStep === 1 ? "1/2" : currentStep === 2 ? "2/2" : ""}
            </p>
          </div>
        </div>
        <form className="grid gap-4 py-5 bg-white border border-[#e5e5e5] border-y-0 rounded-b-lg p-5 shadow-lg">
          {currentStep === 1 && (
            <>
              <div className="space-y-1 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Wager Title
                </Label>
                <Input type="text" placeholder="ex. Fifa challenge" />
              </div>
              <div className="space-y-1 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Wager Description or Terms
                </Label>
                <Textarea
                  placeholder="Enter the terms and necessary information of this wager"
                  className="h-20"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="amount" className="text-right">
                  Wager Amount
                </Label>
                <div className="relative w-32">
                  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <Money size={20} weight="duotone" />
                  </div>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0.00"
                    className="pl-9 w-full"
                    onChange={(e) => {
                      // Only allow numbers and decimal point
                      const value = e.target.value;
                      if (/^(\d*\.?\d{0,2})?$/.test(value)) {
                        e.target.value = value;
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
                <Label>Add Number of Participant</Label>
                <Input type="text" placeholder="ex. 20" />
              </div>
              <div>
                <CalendarForm />
              </div>
              <div>
                <Time />
              </div>
            </>
          )}
          {currentStep === 2 ? (
            <div className="my-5 flex justify-between items-center gap-10 mt-5">
              <button
                className="p-3 border border-[] w-full rounded-xl hover:bg-[#f4f6f7] transition-all ease-in-out duration-500"
                onClick={handlePrevStep}
              >
                Prev
              </button>
              <Button variant="primary" size="md">
                Create Tournament
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center gap-10 mt-5">
              <button
                className="p-3 border border-[] w-full rounded-xl hover:bg-[#f4f6f7] transition-all ease-in-out duration-500"
                onClick={handlePrevStep}
              >
                Prev
              </button>
              <button
                className="p-3 border border-[] w-full rounded-xl bg-[#222254] text-white hover:bg-[#052663] transition-all ease-in-out duration-500"
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
export default CreateTournament;
