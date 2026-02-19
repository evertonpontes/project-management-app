import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInviteCode(length: number = 12): string {
  return Array.from({ length }, () =>
    Math.random().toString(36).charAt(2),
  ).join("");
}

export function formatDate(
  date: string | Date,
  formatStr: string = "PPP",
): string {
  return format(new Date(date), formatStr);
}
