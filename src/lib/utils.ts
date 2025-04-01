import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getUser() {
  if (process.client) {
    const token = window.localStorage.getItem("token");
    if (!token) {
      return { token: "" };
    }
    return { token };
  } else return { token: "" };
}
