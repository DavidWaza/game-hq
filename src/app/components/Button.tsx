"use client";
import React from "react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  width?: "full" | "half";
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  width = "full",
  icon,
  onClick,
  children,
  disabled,
  asChild = false,
}) => {
  // Define variant styles
  const variantClasses = {
    primary: "fine-button-primary",
    secondary: "fine-button-secondary",
  };

  // Define size styles
  const sizeClasses = {
    sm: "px-6 py-4 text-sm",
    md: "px-6 py-4 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const widthClasses = {
    full: "w-full",
    half: "w-1/2 m-auto",
  };

  const className = `flex items-center text-nowrap whitespace-nowrap justify-center gap-2 rounded-lg transition-all duration-500 ease-in-out tracking-wider ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses[width]}`;

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      onClick={onClick}
      disabled={disabled}
      type={asChild ? undefined : "submit"}
      className={className}
    >
      {icon && <span>{icon}</span>}
      {children}
    </Comp>
  );
};

export default Button;
