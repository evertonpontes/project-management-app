"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <div className="size-8 rounded-md bg-teal-500 text-white flex items-center justify-center mr-2">
            <CheckCircleIcon weight="bold" className="size-4" />
          </div>
        ),
        info: (
          <div className="size-8 rounded-md bg-blue-500 text-white flex items-center justify-center mr-2">
            <InfoIcon weight="bold" className="size-4" />
          </div>
        ),
        warning: (
          <div className="size-8 rounded-md bg-amber-500 text-white flex items-center justify-center mr-2">
            <WarningIcon weight="bold" className="size-4" />
          </div>
        ),
        error: (
          <div className="size-8 rounded-md bg-rose-500 text-white flex items-center justify-center mr-2">
            <XCircleIcon weight="bold" className="size-4" />
          </div>
        ),
        loading: (
          <div className="size-8 rounded-md bg-indigo-500 text-white flex items-center justify-center mr-2">
            <SpinnerIcon weight="bold" className="size-4 animate-spin" />
          </div>
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          content: "ml-4",
          loader: "mx-2.5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
