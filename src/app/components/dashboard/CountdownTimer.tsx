"use client";

import { useCallback, useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate?: string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetDate || "") - +new Date();
    let newTimeLeft = {
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

    setTimeLeft(newTimeLeft);
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="flex gap-2 items-center">
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold">{timeLeft.days}</span>
        <span className="text-xs">Days</span>
      </div>
      <span className="text-xl">:</span>
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold">{timeLeft.hours}</span>
        <span className="text-xs">Hours</span>
      </div>
      <span className="text-xl">:</span>
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold">{timeLeft.minutes}</span>
        <span className="text-xs">Minutes</span>
      </div>
      <span className="text-xl">:</span>
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold">{timeLeft.seconds}</span>
        <span className="text-xs">Seconds</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
