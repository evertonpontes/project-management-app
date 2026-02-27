"use client";

import * as React from "react";
import { DrawerPreview as DrawerPrimitive } from "@base-ui/react/drawer";
import { XIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Provider / Indent (for scale-down background effect)              */
/* ------------------------------------------------------------------ */

function BaseDrawerProvider({
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Provider>) {
  return (
    <DrawerPrimitive.Provider data-slot="base-drawer-provider" {...props}>
      {children}
    </DrawerPrimitive.Provider>
  );
}

function BaseDrawerIndentBackground({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.IndentBackground>) {
  return (
    <DrawerPrimitive.IndentBackground
      data-slot="base-drawer-indent-background"
      className={cn("fixed inset-0 bg-background", className)}
      {...props}
    />
  );
}

function BaseDrawerIndent({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Indent>) {
  return (
    <DrawerPrimitive.Indent
      data-slot="base-drawer-indent"
      className={cn(
        "origin-bottom transition-transform duration-300 ease-out data-[active]:scale-[0.94] data-[active]:rounded-t-lg",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

type SwipeDirection = "up" | "down" | "left" | "right";

interface BaseDrawerProps extends Omit<
  React.ComponentProps<typeof DrawerPrimitive.Root>,
  "swipeDirection"
> {
  /** Direction for swipe-to-dismiss. Also determines the drawer position. */
  swipeDirection?: SwipeDirection;
}

function BaseDrawer({ swipeDirection = "down", ...props }: BaseDrawerProps) {
  return (
    <DrawerPrimitive.Root
      data-slot="base-drawer"
      swipeDirection={swipeDirection}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Trigger                                                            */
/* ------------------------------------------------------------------ */

function BaseDrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="base-drawer-trigger" {...props} />;
}

/* ------------------------------------------------------------------ */
/*  Close                                                              */
/* ------------------------------------------------------------------ */

function BaseDrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="base-drawer-close" {...props} />;
}

/* ------------------------------------------------------------------ */
/*  Portal                                                             */
/* ------------------------------------------------------------------ */

function BaseDrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="base-drawer-portal" {...props} />;
}

/* ------------------------------------------------------------------ */
/*  Backdrop                                                           */
/* ------------------------------------------------------------------ */

function BaseDrawerBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Backdrop>) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="base-drawer-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
        "data-starting-style:opacity-0",
        "data-ending-style:opacity-0",
        className,
      )}
      style={{
        opacity: `calc(0.5 * (1 - var(--drawer-swipe-progress, 0)))`,
      }}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Viewport                                                           */
/* ------------------------------------------------------------------ */

function BaseDrawerViewport({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Viewport>) {
  return (
    <DrawerPrimitive.Viewport
      data-slot="base-drawer-viewport"
      className={cn("fixed inset-0 z-50 flex", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Popup                                                              */
/* ------------------------------------------------------------------ */

function BaseDrawerPopup({
  className,
  children,
  direction = "bottom",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Popup> & {
  direction?: "top" | "bottom" | "left" | "right";
}) {
  const isVertical = direction === "top" || direction === "bottom";

  const directionStyles: Record<string, string> = {
    bottom: cn(
      "inset-x-0 bottom-0 mt-24 max-h-[80vh] rounded-t-lg border-t",
      "data-[starting-style]:translate-y-full",
      "data-[ending-style]:translate-y-full",
    ),
    top: cn(
      "inset-x-0 top-0 mb-24 max-h-[80vh] rounded-b-lg border-b",
      "data-[starting-style]:-translate-y-full",
      "data-[ending-style]:-translate-y-full",
    ),
    left: cn(
      "inset-y-0 left-0 w-3/4 border-r sm:max-w-sm",
      "data-[starting-style]:-translate-x-full",
      "data-[ending-style]:-translate-x-full",
    ),
    right: cn(
      "inset-y-0 right-0 w-3/4 border-l sm:max-w-sm",
      "data-[starting-style]:translate-x-full",
      "data-[ending-style]:translate-x-full",
    ),
  };

  return (
    <DrawerPrimitive.Popup
      data-slot="base-drawer-popup"
      className={cn(
        "bg-background fixed z-50 flex flex-col shadow-lg transition-transform duration-450 ease-[cubic-bezier(0.32,0.72,0,1)]",
        directionStyles[direction],
        className,
      )}
      {...props}
    >
      {isVertical && direction === "bottom" && (
        <div className="mx-auto mt-4 h-1.5 w-[100px] shrink-0 rounded-full bg-muted" />
      )}
      {children}
    </DrawerPrimitive.Popup>
  );
}

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

function BaseDrawerContent({
  className,
  children,
  showCloseButton = true,
  direction = "bottom",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  showCloseButton?: boolean;
  direction?: "top" | "bottom" | "left" | "right";
}) {
  const isVertical = direction === "top" || direction === "bottom";

  return (
    <DrawerPrimitive.Content
      data-slot="base-drawer-content"
      className={cn("relative flex flex-1 flex-col overflow-auto", className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DrawerPrimitive.Close
          data-slot="base-drawer-close"
          className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        >
          <XIcon />
          <span className="sr-only">Fechar</span>
        </DrawerPrimitive.Close>
      )}
      {isVertical && direction === "top" && (
        <div className="mx-auto mb-4 h-1.5 w-[100px] shrink-0 rounded-full bg-muted" />
      )}
    </DrawerPrimitive.Content>
  );
}

/* ------------------------------------------------------------------ */
/*  Header / Footer / Title / Description                              */
/* ------------------------------------------------------------------ */

function BaseDrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="base-drawer-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function BaseDrawerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="base-drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function BaseDrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="base-drawer-title"
      className={cn(
        "text-lg font-semibold leading-none text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function BaseDrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="base-drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  BaseDrawer,
  BaseDrawerBackdrop,
  BaseDrawerClose,
  BaseDrawerContent,
  BaseDrawerDescription,
  BaseDrawerFooter,
  BaseDrawerHeader,
  BaseDrawerIndent,
  BaseDrawerIndentBackground,
  BaseDrawerPopup,
  BaseDrawerPortal,
  BaseDrawerProvider,
  BaseDrawerTitle,
  BaseDrawerTrigger,
  BaseDrawerViewport,
};
