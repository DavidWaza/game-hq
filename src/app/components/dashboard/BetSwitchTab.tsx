"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
  useCallback,
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
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TypeUserSearch } from "../../../../types/global";
import { CalendarForm } from "./Calendar";
import EventScheduler from "./TimerSchedule";
import { useRouter } from "next/navigation";

interface CreateTournamentProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  gameName?: string | null;
}
interface FormData {
  game_id: string;
  title: string;
  description: string;
  amount: number | null;
  match_date: string;
  match_time: string;
  users?: string[];
}

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

const BetSwitchTab = forwardRef((props: CreateTournamentProps, ref) => {
  const { setLoading, loading } = props;
  const [isPrivate] = useState(true);
  const router = useRouter();
  const [maxInvitees, setMaxInvitees] = useState(0);
  const [invitees, setInvitees] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TypeUserSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { store, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    control,
    watch,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      game_id: "",
      title: "",
      description: "",
      amount: null,
      match_date: "",
      match_time: "",
    },
  });

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

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (!query || query.length < 3) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response: TypeUserSearch[] = await postFn(
            `api/search-users?query=@${query}`,
            null
          );
          if (response) {
            const filteredResults = response.filter(
              (result) =>
                result.id !== user?.id &&
                !invitees.includes(result.username || result.email)
            );
            setSearchResults(filteredResults);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Error searching users:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 500); // 500ms debounce delay
    },
    [user?.id, invitees]
  );

  // Handle search input change with debounce
  useEffect(() => {
    debouncedSearch(search);

    return () => {
      // Clean up timeout on unmount
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, debouncedSearch]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const route = isPrivate ? "api/privatewagers/add" : "api/publicwagers/add";
    if (isPrivate && invitees.length === 0) {
      toast.error("Please invite at least one user", {
        position: "top-right",
        className: "p-4",
      });
      return;
    }
    if (isPrivate && invitees.length > maxInvitees) {
      toast.error(`Please invite at most ${maxInvitees} users`, {
        position: "top-right",
        className: "p-4",
      });
      return;
    }
    try {
      setLoading(true);
      if (isPrivate) {
        data.users = invitees;
      }
      const response = await postFn(route, data);
      if (response) {
        toast.success("Match Created Successfully", {
          position: "top-right",
          className: "p-4",
        });
        console.log(response);
        router.push(`/dashboard/my-games`);
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

  // Handle deleting an invitee
  const deleteInvitee = (index: number) => {
    if (invitees.length === 1) return;
    const updatedInvitees = invitees.filter((_, i) => i !== index);
    setInvitees(updatedInvitees);
  };

  // Modified to prevent form submission since we're using debounce
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Handle input focus and blur
  const handleInputFocus = () => {
    setIsInputFocused(true);

    // If we already have results, show them immediately on focus
    if (searchResults.length === 0 && search.length > 0) {
      debouncedSearch(search);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, 200);
  };

  return (
    <section className="transIn">
      {/* Form: Public/Private Bet */}
      <div className="w-full mt-6 grid gap-4 h-[30rem]">
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
            disabled={loading}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
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
                  ?.filter(
                    (game) =>
                      game.gametype === "invite" || game.gametype === "both"
                  )
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
          <label
            htmlFor="description-single"
            className="block text-sm text-gray-300"
          >
            Note to Participants
          </label>
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
              placeholder="Min of 500"
              disabled={loading}
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
            value={watch("match_time")}
            onTimeChange={(match_time) => {
              setValue("match_time", match_time, { shouldValidate: true });
            }}
            {...register("match_time", {
              required: "Match time is required",
            })}
            disabled={loading}
          />
          {errors.match_time && (
            <p className="text-red-500 text-sm">{errors.match_time.message}</p>
          )}
        </div>

        {/* Private Bet Fields */}
        {isPrivate && (
          <div className="space-y-4 transIn pb-20">
            <div>
              <div className="relative">
                <Input
                  id="search-gamers"
                  type="text"
                  className="p-3 w-full bg-gray-700 text-white rounded-lg shadow-md !h-[50px]"
                  placeholder="Search users"
                  value={search}
                  onChange={handleSearchInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  disabled={invitees.length >= maxInvitees || loading}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="h-5 w-5 border-2 border-t-transparent border-[#EB8338] rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {(isInputFocused || searchResults.length > 0) && (
                <div className="transIn mt-2 bg-gray-800 rounded-lg max-h-40 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="p-2 hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          // Add user to invitees
                          const username = user.username || user.email;
                          if (
                            username &&
                            !invitees.includes(username) &&
                            invitees.length < maxInvitees
                          ) {
                            setInvitees((prev) => [
                              ...prev.filter((inv) => inv !== ""),
                              username,
                            ]);
                            setSearch("");
                          }
                        }}
                      >
                        {user.username || user.email}
                      </div>
                    ))
                  ) : search.length > 0 ? (
                    search.length < 3 ? (
                      <div className="p-2 text-gray-400">
                        Type at least 3 characters to search
                      </div>
                    ) : isSearching ? (
                      <div className="p-2 text-gray-400">Searching...</div>
                    ) : (
                      <div className="p-2 text-gray-400">No results found</div>
                    )
                  ) : (
                    isInputFocused && (
                      <div className="p-2 text-gray-400">
                        Type at least 3 characters to search
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
            {maxInvitees > 0 && (
              <div className="transIn">
                <label className="block text-sm text-gray-300">
                  Invite Users (max {maxInvitees})
                </label>
                {invitees.length > 0 &&
                  invitees.map((invitee, index) => (
                    <div
                      key={index + 32323 + invitee}
                      className="transIn flex items-center space-x-2 mb-5"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-[#EB8338] text-white rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        className="w-full mt-2 p-3 bg-gray-700 text-white rounded-lg shadow-md"
                        placeholder={`Invitee ${index + 1}`}
                        value={invitee}
                        disabled
                      />
                      {invitees.length !== 1 && (
                        <button
                          type="button"
                          onClick={() => deleteInvitee(index)}
                          className="mt-2 text-red-500 hover:text-red-700 transition-colors"
                          disabled={invitees.length === 1}
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
                {/* <button
                type="button"
                onClick={handleAddInvitee}
                className="ml-auto px-4 py-2 rounded-lg text-sm flex items-center whitespace-nowrap bg-[#202216] text-[#F0DE9B]"
              >
                + Add Invitee
              </button> */}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
});
BetSwitchTab.displayName = "BetSwitchTab";
export default BetSwitchTab;
