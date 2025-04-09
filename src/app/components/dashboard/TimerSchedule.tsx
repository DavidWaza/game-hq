// EventScheduler.jsx
"use client";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

interface Event {
  time: string;
}

const EventScheduler = ({
  onTimeChange,
}: {
  onTimeChange: (date: string) => void;
}) => {
  const [newEvent, setNewEvent] = useState<Event>({
    time: "",
  });
  console.log(onTimeChange);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
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
            className="border rounded-lg p-2 w-full bg-transparent text-white "
          />
        </div>
    </div>
  );
};

export default EventScheduler;
