// StatusIndicator.tsx
import React from "react";

type StatusType = "online" | "away" | "offline";
type SizeType = "sm" | "md" | "lg";

interface StatusIndicatorProps {
  status: StatusType;
  size?: SizeType;
  showLabel?: boolean;
}

const statusStyles: Record<
  StatusType,
  { color: string; label: string; bgColor: string }
> = {
  online: {
    color: "bg-green-700",
    bgColor: "bg-green-300",
    label: "Online",
  },
  offline: {
    color: "bg-yellow-700",
    bgColor: "bg-yellow-300",
    label: "Offline",
  },
  away: {
    color: "bg-gray-700",
    bgColor: "bg-gray-300",
    label: "Away",
  },
};

const sizeStyles: Record<SizeType, string> = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = "sm",
  showLabel = true,
}) => {
  const currentStatus = statusStyles[status] || statusStyles.offline;
  const currentSize = sizeStyles[size];

  return (
    <div
      className={`flex items-center space-x-2 ${currentStatus.bgColor} px-2 rounded-full`}
    >
      <span
        className={`${
          currentStatus.color
        } ${currentSize} rounded-full inline-block ${
          currentStatus.label === "Online" ? "animate-pulse" : ""
        }`}
        title={currentStatus.label}
      ></span>
      {showLabel && (
        <span className="text-sm text-gray-700">{currentStatus.label}</span>
      )}
    </div>
  );
};

export default StatusIndicator;
