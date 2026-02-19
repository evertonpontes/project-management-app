"use client";

import { JSX, useState } from "react";
import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/responsive-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const useConfirm = (
  title: string,
  description: string,
  variant: VariantProps<typeof buttonVariants>["variant"] = "default",
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => setPromise({ resolve }));
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveModal
      open={promise !== null}
      onOpenChange={handleCancel}
      className="p-0 md:p-0"
    >
      <Card className="w-full h-full ring-0 shadow-none py-0 pt-4">
        <CardContent className="px-0">
          <CardHeader className="px-8 border-b border-muted-foreground/10 shadow-xs">
            <CardTitle className="">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <div className="pt-4 flex gap-4 flex-col lg:flex-row items-center lg:justify-end px-8 bg-muted pb-4">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full lg:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variant}
              className="w-full lg:w-auto"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );

  return [ConfirmationDialog, confirm];
};

export { useConfirm };
