"use client";
import { useState } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Label } from "@/components/ui/label";

const Time = ({ onTimeChange }: { onTimeChange: (date: string) => void }) => {
  const [value, onChange] = useState("10:00");
  console.log(onTimeChange);
  return (
    <div className="inline-flex flex-col space-y-1">
      <Label>Set Time for event</Label>
      <TimePicker
        onChange={(val) => onChange(val || "10:00")}
        value={value}
        className={"clock-style"}
      />
    </div>
  );
};
export default Time;
