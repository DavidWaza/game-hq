"use client";
import React from "react";
import ButtonSpinner from "@/components/ButtonSpinner";

interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  width?: "full" | "half";
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
  asChild?: boolean;
  spinnerColor?: string;
  className?: string;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  width = "full",
  icon,
  onClick,
  type = "submit",
  children,
  disabled,
  className,
  loading = false,
  asChild = false,
  spinnerColor = "#fff",
}) => {
  // Define variant styles
  const variantClasses = {
    primary: "fine-button-primary",
    secondary: "fine-button-secondary uppercase",
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

  const classes = `flex items-center text-nowrap whitespace-nowrap justify-center gap-2 rounded-lg transition-all duration-500 ease-in-out tracking-wider ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses[width]} ${className}`;

  const Comp = asChild ? "div" : "button";

  return (
    <Comp
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={classes}
    >
      {!loading ? (
        <>
          {" "}
          {icon && <span className="min-w-max">{icon}</span>}
          {children}
        </>
      ) : (
        <ButtonSpinner color={spinnerColor} />
      )}
    </Comp>
  );
};

export default Button;
