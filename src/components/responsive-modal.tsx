"use client";

import useMedia from "use-media";

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "./ui/drawer";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  children: React.ReactNode;
}

const ResponsiveModal = ({
  open,
  onOpenChange,
  children,
}: ResponsiveModalProps) => {
  const isDesktop = useMedia({ minWidth: "1024px" });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full min-w-lg">
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
        <div className="p-6 md:p-10">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export { ResponsiveModal };
