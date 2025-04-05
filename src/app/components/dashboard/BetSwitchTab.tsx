import React, { useState } from "react";
import Button from "../Button";
import { CaretDoubleLeft, Money } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const BetSwitchTab = () => {
  const [isPrivate, setIsPrivate] = useState(false); // Toggle between public and private
  const [betDetails, setBetDetails] = useState({
    description: "",
    amount: "",
    gameTitle: "",
    invitees: [""],
  });
  const router = useRouter();

  // Handle tab toggle (public/private)
  const handleTabToggle = () => {
    setIsPrivate((prev) => !prev);
  };

  // Handle input changes (bet details)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
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

  return (
    <div className="relative bg-black text-white p-6 bg-opacity-90 rounded-2xl shadow-lg border-4 border-[#fcf8db] w-full lg:w-[500px] grid grid-cols-1 gap-4">
      {/* Switch Button: Public/Private Bet */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={handleTabToggle}
          className={`px-6 py-2 rounded-lg text-lg font-bold transition-all duration-300 ${
            !isPrivate
              ? "bg-[#202216] text-[#F0DE9B]"
              : "bg-gray-600 text-white"
          }`}
        >
          Public Bet
        </button>
        <button
          onClick={handleTabToggle}
          className={`px-6 py-2 rounded-lg text-lg font-bold transition-all duration-300 ${
            isPrivate ? "bg-[#202216] text-[#F0DE9B]" : "bg-gray-600 text-white"
          }`}
        >
          Private Bet
        </button>
      </div>

      {/* Form: Public/Private Bet */}
      <div className="w-full max-w-md mt-6">
        {/* Common Fields for both Public and Private */}
        <div className="mb-4">
          <label htmlFor="gameTitle" className="block text-sm text-gray-300">
            Bet Title
          </label>
          <input
            id="gameTitle"
            type="text"
            className="w-full mt-2 p-3 bg-gray-700 text-white rounded-lg shadow-md"
            placeholder="Enter game title"
            value={betDetails.gameTitle}
            onChange={(e) => handleInputChange(e, "gameTitle")}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm text-gray-300">
            Bet Description
          </label>
          <input
            id="description"
            type="text"
            className="w-full mt-2 p-3 bg-gray-700 text-white rounded-lg shadow-md"
            placeholder="Enter bet description"
            value={betDetails.description}
            onChange={(e) => handleInputChange(e, "description")}
          />
        </div>
        <div className="space-y-1 mb-4">
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
              className="pl-9 w-full mt-2 bg-gray-700 text-white rounded-lg shadow-md"
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

        {/* Private Bet Fields */}
        {isPrivate && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300">
                Invite Users
              </label>
              {betDetails.invitees.map((invitee, index) => (
                <div key={index} className="flex items-center space-x-2 mb-5">
                  <input
                    type="text"
                    className="w-3/4 mt-2 p-3 bg-gray-700 text-white rounded-lg shadow-md"
                    placeholder={`Invitee ${index + 1}`}
                    value={invitee}
                    onChange={(e) => handleInviteeChange(e, index)}
                  />
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
                  {index === betDetails.invitees.length - 1 && (
                    <button
                      type="button"
                      onClick={handleAddInvitee}
                      className="px-4 py-2 rounded-lg text-sm flex items-center whitespace-nowrap bg-[#202216] text-[#F0DE9B]"
                    >
                      + Add Invitee
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button>Create Bet</Button>
      </div>
      <div
        onClick={() => router.back()}
        className="text-white text-center pt-5 flex items-center justify-center gap-3 hover:animate-bounce cursor-pointer"
      >
        <CaretDoubleLeft size={25} />
        Back
      </div>
    </div>
  );
};

export default BetSwitchTab;
