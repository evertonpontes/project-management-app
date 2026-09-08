"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

interface ModalProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (value?: boolean) => void;
  children: React.ReactNode;
}

export function Modal({ ...props }: ModalProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.description}</DialogDescription>
          </DialogHeader>
          <div className="flex max-w-2xl flex-1 flex-col items-center gap-2">
            {props.children}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={props.open} onOpenChange={props.onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>{props.description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex max-h-173 flex-1 flex-col items-center">
          {props.children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
