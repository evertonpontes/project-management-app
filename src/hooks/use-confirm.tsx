"use client"

import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { ComponentProps, JSX, useState } from "react";

export function useConfirm(
    title: string,
    description: string,
    variant: ComponentProps<typeof Button>["variant"] = "default"
): readonly [() => JSX.Element, () => Promise<boolean>] {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

    const confirm = (): Promise<boolean> => {
        return new Promise(resolve => {
            setPromise({ resolve })
        })
    }

    const handleClose = () => {
        setPromise(null)
    }

    const handleConfirm = () => {
        promise?.resolve(true)
        handleClose()
    }

    const handleCancel = () => {
        promise?.resolve(false)
        handleClose()
    }

    const ConfirmationDialog = () => (
        <Modal
            title={title}
            description={description}
            open={promise != null}
            onOpenChange={handleClose}
        >
            <div className="flex justify-end items-center gap-2 py-4">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button variant={variant} onClick={handleConfirm}>Confirm</Button>
            </div>
        </Modal>
    )

    return [ConfirmationDialog, confirm] as const
}