import React, { useEffect, useState } from "react";

const CountdownTimer = () => {
  const targetDate = new Date("2025-06-01T00:00:00").getTime(); // Set your target date here

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex space-x-4 text-[#FCF8DB] mt-5">
      {Object.entries(timeLeft).map(([unit, value], index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center w-20 h-20 bg-gray-900 border-2 border-[#222C36] rounded-lg shadow-md"
        >
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-xs uppercase opacity-80">{unit}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
