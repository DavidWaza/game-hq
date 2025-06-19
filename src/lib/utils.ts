import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TypeSingleTournament } from "../../types/global";
import { toast } from "sonner";

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
export const removeDuplicates = <T extends Record<string, unknown>>(arr: Array<T>, prop: string | null = null) => {
  const uniqueValues = new Set();
  return arr.filter(function (item: T) {
    if (prop) {
      if (item[prop] === null || !uniqueValues.has(item[prop])) {
        uniqueValues.add(item[prop]);
        return true;
      }
      return false;
    } else {
      if (item === null || !uniqueValues.has(item)) {
        uniqueValues.add(item);
        return true;
      }
      return false;
    }
  });
};

export function formatNumber(arg: string | number, decimals: number = 0) {
  const number = Number(arg ? arg : 0);
  // Convert the number to a string and use toLocaleString to add commas
  return number.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
export function calculateTournamentOdds(data: TypeSingleTournament | undefined) {

  const oddsDetails = {
    first: { percentage: 0, odds: 0, amount: 0 },
    second: { percentage: 0, odds: 0, amount: 0 },
    third: { percentage: 0, odds: 0, amount: 0 },
    totalOdds: 0,
  };
  if (data) {
    const availablePool = Number(data?.amount) * 0.9;
    const players = data?.number_of_participants || 0

    if (players === 2) {
      oddsDetails.first = { percentage: 100, odds: 1.8, amount: availablePool };
      oddsDetails.totalOdds = 1.8;
    } else if (players === 3) {
      oddsDetails.first = { percentage: 100, odds: 2.7, amount: availablePool };
      oddsDetails.totalOdds = 2.7;
    } else if (players === 4) {
      oddsDetails.first = {
        percentage: 75,
        odds: 2.7,
        amount: availablePool * 0.75,
      };
      oddsDetails.second = {
        percentage: 25,
        odds: 0.9,
        amount: availablePool * 0.25,
      };
      oddsDetails.totalOdds = 2.7 + 0.9;
    } else if (players >= 5 && players <= 10) {
      // Linear scaling for odds
      const t = (players - 5) / 5;
      const oddsFirst = 2.7 + t * (5.4 - 2.7);
      const oddsSecond = 1.35 + t * (2.7 - 1.35);
      const oddsThird = 0.45 + t * (0.9 - 0.45);

      oddsDetails.first = {
        percentage: 60,
        odds: oddsFirst,
        amount: availablePool * 0.6,
      };
      oddsDetails.second = {
        percentage: 30,
        odds: oddsSecond,
        amount: availablePool * 0.3,
      };
      oddsDetails.third = {
        percentage: 10,
        odds: oddsThird,
        amount: availablePool * 0.1,
      };
      oddsDetails.totalOdds = oddsFirst + oddsSecond + oddsThird;
    }
  }

  return oddsDetails;
}
export function copyToClipboard(text: string = 'Text', statusText: string = 'Link copied to clipboard!') {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(statusText, {
      position: "top-right",
      className: "p-4",
    });
  }).catch((err) => {
    toast.error('Failed to copy URL', {
      position: "top-right",
      className: "p-4",
    });
    console.error(err)
  });
}
export function setSearchParams(searchParam: Record<string, string>, allowEmpty: boolean = false) {
  let params = "";
  Object.entries(searchParam).forEach(([key, value], index) => {
    if (value !== undefined && value !== null && value !== '') {
      if (!index) {
        params += `?${key}=${value}`;
      } else params += `&${key}=${value}`;
    } else if (allowEmpty && !value) {
      params += `${key}&`;
    }
  });
  return params;
}
