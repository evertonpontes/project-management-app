"use client";

import useMedia from "use-media";

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "./ui/drawer";
import { cn } from "@/lib/utils";
import {
  BaseDrawer,
  BaseDrawerBackdrop,
  BaseDrawerContent,
  BaseDrawerPopup,
  BaseDrawerPortal,
  BaseDrawerTitle,
  BaseDrawerViewport,
} from "./ui/base-drawer";

interface ResponsiveModalProps extends React.ComponentProps<"div"> {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  children: React.ReactNode;
}

const ResponsiveModal = ({
  open,
  onOpenChange,
  children,
  className,
}: ResponsiveModalProps) => {
  const isDesktop = useMedia({ minWidth: "1024px" });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("w-full min-w-lg", className)}>
          <DialogTitle className="sr-only">Menu</DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <BaseDrawer open={open} onOpenChange={onOpenChange}>
      <BaseDrawerPortal>
        <BaseDrawerBackdrop />
        <BaseDrawerViewport>
          <BaseDrawerPopup>
            <BaseDrawerContent className={cn("w-full min-w-lg", className)}>
              <BaseDrawerTitle className="sr-only">Menu</BaseDrawerTitle>
              <div className={cn("p-6 md:p-10", className)}>{children}</div>
            </BaseDrawerContent>
          </BaseDrawerPopup>
        </BaseDrawerViewport>
      </BaseDrawerPortal>
    </BaseDrawer>
  );
};

export { ResponsiveModal };
