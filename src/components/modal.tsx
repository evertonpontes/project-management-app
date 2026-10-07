"use client";

import * as React from "react";
import { cn } from "cn";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface ModalProps {
    /**
     * Controls whether the modal is visible.
     */
    open?: boolean;
    /**
     * Callback invoked when the open state changes.
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * Title displayed at the top of the modal.
     */
    title?: React.ReactNode;
    /**
     * Subtitle or description placed beneath the title.
     */
    description?: React.ReactNode;
    /**
     * Body content of the modal.
     */
    children?: React.ReactNode;
    /**
     * Optional trigger element that opens the modal.
     */
    trigger?: React.ReactNode;
    /**
     * Optional footer element (actions, buttons, etc.).
     */
    footer?: React.ReactNode;
    /**
     * Additional CSS classes applied to the dialog/drawer content container.
     */
    className?: string;
    /**
     * Additional CSS classes applied specifically to the desktop dialog content.
     */
    dialogClassName?: string;
    /**
     * Additional CSS classes applied specifically to the mobile drawer content.
     */
    drawerClassName?: string;
    /**
     * Whether to display the close button in the top right corner of the desktop dialog (defaults to true).
     */
    showCloseButton?: boolean;
    /**
     * Whether to show the swipe handle pill indicator on mobile (defaults to true).
     */
    showSwipeHandle?: boolean;
    /**
     * Custom media query breakpoint to toggle between mobile drawer and desktop dialog (defaults to "(max-width: 768px)").
     */
    breakpoint?: string;
}

export function Modal({
    open,
    onOpenChange,
    title,
    description,
    children,
    trigger,
    footer,
    className,
    dialogClassName,
    drawerClassName,
    showCloseButton = true,
    showSwipeHandle = true,
    breakpoint = "(max-width: 768px)",
}: ModalProps) {
    const isMobile = useMediaQuery(breakpoint);

    if (isMobile) {
        return (
            <Drawer
                open={open}
                onOpenChange={onOpenChange}
                showSwipeHandle={showSwipeHandle}
            >
                {trigger && (
                    <DrawerTrigger
                        render={React.isValidElement(trigger) ? trigger : undefined}
                    >
                        {!React.isValidElement(trigger) ? trigger : undefined}
                    </DrawerTrigger>
                )}
                <DrawerContent className={cn(className, drawerClassName)}>
                    {(title || description) ? (
                        <DrawerHeader>
                            {title ? (
                                <DrawerTitle>{title}</DrawerTitle>
                            ) : (
                                <DrawerTitle className="sr-only">Modal</DrawerTitle>
                            )}
                            {description && (
                                <DrawerDescription>{description}</DrawerDescription>
                            )}
                        </DrawerHeader>
                    ) : (
                        <DrawerTitle className="sr-only">Modal</DrawerTitle>
                    )}
                    <div
                        className={cn(
                            "overflow-y-auto px-4 pb-4",
                            !(title || description) && "pt-4"
                        )}
                    >
                        {children}
                    </div>
                    {footer && <DrawerFooter>{footer}</DrawerFooter>}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && (
                <DialogTrigger
                    render={React.isValidElement(trigger) ? trigger : undefined}
                >
                    {!React.isValidElement(trigger) ? trigger : undefined}
                </DialogTrigger>
            )}
            <DialogContent
                className={cn(className, dialogClassName)}
                showCloseButton={showCloseButton}
            >
                {(title || description) ? (
                    <DialogHeader>
                        {title ? (
                            <DialogTitle>{title}</DialogTitle>
                        ) : (
                            <DialogTitle className="sr-only">Modal</DialogTitle>
                        )}
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>
                ) : (
                    <DialogTitle className="sr-only">Modal</DialogTitle>
                )}
                {children}
                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
}

export { Modal as ResponsiveModal };
export default Modal;
