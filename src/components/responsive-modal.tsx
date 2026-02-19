"use client";

import useMedia from "use-media";

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "./ui/drawer";
import { cn } from "@/lib/utils";

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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="drawer-modal">
        <DrawerTitle className="sr-only">Menu</DrawerTitle>
        <div className={cn("p-6 md:p-10", className)}>{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export { ResponsiveModal };
