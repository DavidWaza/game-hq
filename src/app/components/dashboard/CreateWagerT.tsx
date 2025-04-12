"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Money } from "@phosphor-icons/react";
import { CalendarForm } from "@/app/components/dashboard/Calendar";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { postFn } from "@/lib/apiClient";
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
interface CreateTournamentProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateTournament = forwardRef((props: CreateTournamentProps, ref) => {
  const { setLoading } = props;
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { store } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      const response = await postFn("api/tournamentstables/add", data);
      toast.success("Tournament Created Successfully", {
        position: "top-right",
        className: "p-4",
      });
      router.push(`/dashboard/join-tournament/${response.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again", {
        position: "top-right",
        className: "p-4",
      });
    } finally {
      setLoading(false);
    }
  };

  // Expose the submit function to the parent component
  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      const isValidForm = await trigger(); // Trigger validation for all fields
      if (isValidForm) {
        handleSubmit(onSubmit)(); // Submit the form if valid
        return true; // Indicate success
      }
      return false; // Indicate failure
    },
  }));

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full transIn">
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Select Game */}
        <div className="space-y-2">
          <Label>Select Game</Label>
          <Select
            onValueChange={handleCategoryChange}
            {...register("category_id", {
              required: "Game category is required",
            })}
          >
            <SelectTrigger className="w-full p-3 !h-[50px] bg-gray-700 text-white text-base rounded-lg shadow-md">
              <SelectValue
                className="text-[#9ca3af] text-base"
                placeholder="Select Game"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {store?.categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-red-500 text-sm">{errors.category_id.message}</p>
          )}
        </div>
        {/* Bet On */}
        {/* Note to Participants */}
        <div className="space-y-2 items-center gap-4">
          <Label htmlFor="description">Note to Participants</Label>
          <Textarea
            {...register("description", {
              required: "Note description is required",
            })}
            id="description"
            placeholder="Enter the terms and necessary information of this bet"
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md resize-none h-[150px]"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        {/* Wager Amount */}
        <div className="space-y-2">
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
              step={500}
              min={500}
              type="number"
              id="amount"
              placeholder="0.00"
              className="p-3 pl-9 w-full bg-gray-700 text-white rounded-lg shadow-md !h-[50px]"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>
        {/* Number of Participants */}
        <div className="space-y-2">
          <Label htmlFor="number_of_participants">Number of Participants</Label>
          <Input
            {...register("number_of_participants", {
              required: "Number of participants is required",
              min: { value: 1, message: "Must be at least 1" },
            })}
            step={1}
            min={1}
            type="number"
            id="number_of_participants"
            placeholder="ex. 20"
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md !h-[50px]"
          />
          {errors.number_of_participants && (
            <p className="text-red-500 text-sm">
              {errors.number_of_participants.message}
            </p>
          )}
        </div>
        {/* Date */}
        <div className="space-y-2">
          <CalendarForm
            onDateChange={handleDateChange}
            {...register("created_at", {
              required: "Date is required",
            })}
            label={"Select a date"}
          />
          {errors.created_at && (
            <p className="text-red-500 text-sm">{errors.created_at.message}</p>
          )}
        </div>
        {/* Match Time */}
        <div className="space-y-2">
          <EventScheduler
            onTimeChange={handleTimeChange}
            {...register("match_time", {
              required: "Match time is required",
            })}
          />
          {errors.match_time && (
            <p className="text-red-500 text-sm">{errors.match_time.message}</p>
          )}
        </div>
      </form>
    </div>
  );
});

// Add displayName for debugging
CreateTournament.displayName = "CreateTournament";
export default CreateTournament;
