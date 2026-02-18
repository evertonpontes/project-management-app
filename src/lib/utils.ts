import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInviteCode(length: number = 12): string {
  return Array.from({ length }, () =>
    Math.random().toString(36).charAt(2),
  ).join("");
}
