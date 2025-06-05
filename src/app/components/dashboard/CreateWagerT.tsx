"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import { TypeSingleTournament } from "../../../../types/global";
// import RichTextEditor from "@/components/RichTextEditor";

// Define types
interface FormData {
  game_id: string;
  bet_on: string;
  description: string;
  amount: number | null;
  number_of_participants: number;
  match_date: Date | null;
  match_time: string;
}
interface CreateTournamentProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

const CreateTournament = forwardRef((props: CreateTournamentProps, ref) => {
  const { setLoading, loading } = props;
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { store, setState } = useAuth();
  const router = useRouter();
  const [maxInvitees, setMaxInvitees] = useState(0);
  // const quill = new Quill('#editor');

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    trigger,
    watch,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      game_id: "",
      description: "",
      amount: null,
      number_of_participants: 0,
      match_date: null,
      match_time: "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCategoryChange = useCallback(
    (value: string) => {
      setValue("game_id", value, { shouldValidate: true });
      const selectedGame = store?.games?.find((game) => game.id === value);
      if (selectedGame) {
        setMaxInvitees(Number(selectedGame.maxplayers));
      }
    },
    [setValue, store?.games]
  );

  useEffect(() => {
    if (store.createMatch.game_id) {
      handleCategoryChange(store.createMatch.game_id.toString());
    }
  }, [store.createMatch.game_id, setValue, handleCategoryChange]);

  const handleTimeChange = (match_time: string): void => {
    setValue("match_time", match_time, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      const response: TypeSingleTournament = await postFn(
        "api/tournamentstables/add",
        data
      );
      if (response?.id) {
        toast.success("Tournament Created Successfully", {
          position: "top-right",
          className: "p-4",
        });
        setState(response, "singleTournament");
        router.push(`/dashboard/join-tournament/${response.id}`);
      }
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
      const isValidForm = await trigger();
      if (isValidForm) {
        handleSubmit(onSubmit)();
        return true;
      }
      return false;
    },
  }));

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full transIn">
      <form className="grid gap-4 pb-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Select Game */}
        <div className="space-y-2">
          <Label>Select Game</Label>
          <Select
            {...register("game_id", {
              required: "A game is required",
            })}
            onValueChange={handleCategoryChange}
            value={watch("game_id")}
            disabled={loading}
          >
            <SelectTrigger className="w-full p-3 !h-[50px] bg-gray-700 text-white text-base rounded-lg shadow-md">
              <SelectValue
                className="text-[#9ca3af] text-base"
                placeholder="Select Game"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {store?.games
                  ?.filter((game) => game.gametype !== "invite")
                  .map((game) => (
                    <SelectItem key={game.id} value={game.id.toString()}>
                      {game.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.game_id && (
            <p className="text-red-500 text-sm">{errors.game_id.message}</p>
          )}
        </div>
        {/* Note to Participants */}
        <div className="space-y-2">
          <Label htmlFor="description">Note to Participants</Label>
          <div className="editorWrapper">
            {typeof window !== "undefined" ? (
              <RichTextEditor
                {...register("description", {
                  required: "Description is required",
                })}
                value={watch("description")} // Bind the value to react-hook-form
                disabled={loading}
                onChange={(value) => {
                  setValue(
                    "description",
                    value === "<p><br></p>" ? "" : value,
                    { shouldValidate: true }
                  );
                }} // Update the form value
                placeholder="Enter the rules, terms and necessary information for this match"
              />
            ) : (
              ""
            )}
          </div>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        {/* Wager Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount-single" className="text-right">
            Wager Amount
          </Label>
          <div className="relative w-full">
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
              id="amount-single"
              disabled={loading}
              placeholder="Min of 500"
              onChange={(e) => {
                const num = Number(e.target.value);
                setValue("amount", !num ? null : num && num < 500 ? 500 : num, {
                  shouldValidate: true,
                });
              }}
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
            max={maxInvitees}
            type="number"
            id="number_of_participants"
            placeholder="ex. 20"
            disabled={loading}
            className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md !h-[50px]"
          />
          {errors.number_of_participants && (
            <p className="text-red-500 text-sm">
              {errors.number_of_participants.message}
            </p>
          )}
        </div>
        {/* Date */}
        <Controller
          name="match_date"
          control={control}
          rules={{ required: "Date is required" }}
          render={({ field }) => (
            <CalendarForm
              onDateChange={(date) => field.onChange(date)}
              label="Select a date"
              disabled={loading}
            />
          )}
        />
        {errors.match_date && (
          <p className="text-red-500 text-sm">{errors.match_date.message}</p>
        )}
        {/* Match Time */}
        <div className="space-y-2">
          <EventScheduler
            onTimeChange={handleTimeChange}
            {...register("match_time", {
              required: "Match time is required",
            })}
            disabled={loading}
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
