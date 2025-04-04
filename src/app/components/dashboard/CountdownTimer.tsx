"use client";

import { useCallback, useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate?: Date | string;
}

const CountdownTimer = ({ targetDate = new Date() }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetDate) - +new Date();
    let newTimeLeft: TimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      newTimeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return newTimeLeft;
  }, [targetDate]);

  useEffect(() => {
    // Set initial time left
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="flex gap-2 items-center my-3">
      <div className="flex flex-col items-center bg-[#1A2624] inset-1 border border-black text-[#fcf8db] py-2 px-4 rounded-lg">
        <span className="text-xl font-bold">{timeLeft.days}</span>
        <span className="text-xs">Days</span>
      </div>
      <span className="text-xl">:</span>
      <div className="flex flex-col items-center bg-[#1A2624] inset-1 border border-black text-[#fcf8db] py-2 px-4 rounded-lg">
        <span className="text-xl font-bold">{timeLeft.hours}</span>
        <span className="text-xs">Hours</span>
      </div>
      <span className="text-xl">:</span>
      <div className="flex flex-col items-center bg-[#1A2624] inset-1 border border-black text-[#fcf8db] py-2 px-4 rounded-lg">
        <span className="text-xl font-bold">{timeLeft.minutes}</span>
        <span className="text-xs">Min</span>
      </div>
      <span className="text-xl">:</span>
      <div className="flex flex-col items-center bg-[#1A2624] inset-1 border border-black text-[#8db] py-2 px-4 rounded-lg">
        <span className="text-xl font-bold">{timeLeft.seconds}</span>
        <span className="text-xs">Secs</span>
      </div>
    </div>
  );
};

export default CountdownTimer;