// EventScheduler.jsx
"use client";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

interface Event {
  time: string;
}

const EventScheduler = ({
  onTimeChange,
  disabled = false,
  value = "",
}: {
  onTimeChange: (date: string) => void;
  disabled?: boolean;
  value?: string;
}) => {
  const [newEvent, setNewEvent] = useState<Event>({
    time: value || "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
    onTimeChange(`${value}:00`);
  };

  return (
    <div>
      {/* Form to add new events */}
      <div>
        <Label>Match Time</Label>
        <input
          type="time"
          name="time"
          value={newEvent.time}
          onChange={handleInputChange}
          disabled={disabled}
          // className="border rounded-lg p-2 w-full bg-transparent text-white "
          className="w-full p-3 bg-gray-700 text-white rounded-lg shadow-md !h-[50px]"
        />
      </div>
    </div>
  );
};

export default EventScheduler;
