"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  FormEvent,
} from "react";
import { Money } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
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
import { useForm } from "react-hook-form";
interface CreateTournamentProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
interface FormData {
  game_id: string;
  title: string;
  description: string;
  amount: number;
}

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

const BetSwitchTab = forwardRef((props: CreateTournamentProps, ref) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [betDetails, setBetDetails] = useState({
    description: "",
    amount: "",
    gameTitle: "",
    invitees: [""],
  });
  const [search, setSearch] = useState<string>("");
  const { store } = useAuth();

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
      amount: 0,
    },
  });

  const searchUsers = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search) {
      try {
        const response = await postFn(
          `api/search-users?query=@${search}`,
          null
        );
        console.log(response);
      } catch (error) {}
    }
  };

  // Handle tab toggle (public/private)

  // Handle input changes (bet details)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setBetDetails((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // Handle adding invitees
  const handleAddInvitee = () => {
    setBetDetails((prev) => ({
      ...prev,
      invitees: [...prev.invitees, ""],
    }));
  };

  // Handle invitee input change
  const handleInviteeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedInvitees = [...betDetails.invitees];
    updatedInvitees[index] = e.target.value;
    setBetDetails({ ...betDetails, invitees: updatedInvitees });
  };

  // Handle deleting an invitee
  const deleteInvitee = (index: number) => {
    if (betDetails.invitees.length === 1) return; // Prevent deleting the last input
    const updatedInvitees = betDetails.invitees.filter((_, i) => i !== index);
    setBetDetails({ ...betDetails, invitees: updatedInvitees });
  };

  const handleCategoryChange = (value: string) => {
    setValue("game_id", value, { shouldValidate: true });
  };

  return (
    <section className="transIn">
      {/* Switch Button: Public/Private Bet */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={() => (setIsPublic(true), setIsPrivate(false))}
          disabled={isPublic}
          className={`px-6 py-2 rounded-lg text-lg font-bold transition-all duration-300 ${
            !isPrivate ? "bg-[#EB8338] text-white" : "bg-gray-600 text-black"
          }`}
        >
          Public Bet
        </button>
        <button
          onClick={() => (setIsPrivate(true), setIsPublic(false))}
          disabled={isPrivate}
          className={`px-6 py-2 rounded-lg text-lg font-bold transition-all duration-300 ${
            isPrivate ? "bg-[#EB8338] text-white" : "bg-gray-600 text-black"
          }`}
        >
          Private Bet
        </button>
      </div>

      {/* Form: Public/Private Bet */}
      <div className="w-full mt-6 grid gap-4">
        {/* Common Fields for both Public and Private */}
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="gameTitle-single">Title</label>
          <Input
            {...register("title", {
              required: "Title is required",
            })}
            id="gameTitle-single"
            type="text"
            className="p-3 w-full bg-gray-700 text-white rounded-lg shadow-md !h-[50px]"
            placeholder="Give your battle a title!"
            value={betDetails.gameTitle}
            onChange={(e) => handleInputChange(e, "gameTitle")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        {/* Select Game */}
        <div className="space-y-2">
          <Label>Select Game</Label>
          <Select
            onValueChange={handleCategoryChange}
            {...register("game_id", {
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
                {store?.games?.map((game) => (
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
          <label
            htmlFor="description-single"
            className="block text-sm text-gray-300"
          >
            Note to Participants
          </label>
          <div className="editorWrapper">
            {typeof window !== "undefined" ? (
              <RichTextEditor
                value={watch("description")} // Bind the value to react-hook-form
                onChange={(value) =>
                  setValue("description", value, { shouldValidate: true })
                } // Update the form value
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
              id="amount-single"
              placeholder="0.00"
              className="p-3 pl-9 w-full bg-gray-700 text-white rounded-lg shadow-md !h-[50px]"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>

        {/* Private Bet Fields */}
        {isPrivate && (
          <div className="space-y-4 transIn">
            <form onSubmit={(e) => searchUsers(e)}>
              <Input
                id="search-gamers"
                type="text"
                className="p-3 w-full bg-gray-700 text-white rounded-lg shadow-md !h-[50px]"
                placeholder="Search users"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>
            <div>
              <label className="block text-sm text-gray-300">
                Invite Users
              </label>
              {betDetails.invitees.map((invitee, index) => (
                <div key={index} className="flex items-center space-x-2 mb-5">
                  <input
                    type="text"
                    className="w-full mt-2 p-3 bg-gray-700 text-white rounded-lg shadow-md"
                    placeholder={`Invitee ${index + 1}`}
                    value={invitee}
                    onChange={(e) => handleInviteeChange(e, index)}
                  />
                  {betDetails.invitees.length !== 1 && (
                    <button
                      type="button"
                      onClick={() => deleteInvitee(index)}
                      className="mt-2 text-red-500 hover:text-red-700 transition-colors"
                      disabled={betDetails.invitees.length === 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M3 7h18"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddInvitee}
                className="ml-auto px-4 py-2 rounded-lg text-sm flex items-center whitespace-nowrap bg-[#202216] text-[#F0DE9B]"
              >
                + Add Invitee
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});
BetSwitchTab.displayName = "BetSwitchTab";
export default BetSwitchTab;
