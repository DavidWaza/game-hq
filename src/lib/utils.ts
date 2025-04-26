import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  num: string | number,
  formatType: string = "NGN",
  formatLang: string = "en-NG"
) {
  if (num === null || num === undefined) return "Nil";
  const formatter = new Intl.NumberFormat(formatLang, {
    style: "currency",
    currency: formatType,
  });
  return formatter.format(Number(num));
}

export function formatNumber(arg: string | number) {
  const number = Number(arg ? arg : 0);
  // Convert the number to a string and use toLocaleString to add commas
  return number.toLocaleString();
}