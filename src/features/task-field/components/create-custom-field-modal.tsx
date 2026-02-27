"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { CreateCustomFieldForm } from "./create-custom-field-form";
import { useCreateCustomFieldModal } from "../hooks/use-create-custom-field-modal";
import { ResponsiveModal } from "@/components/responsive-modal";
import { createCustomTaskFieldSchema } from "../schemas";

const CreateCustomFieldModal = () => {
  const { open, setOpen, onClose } = useCreateCustomFieldModal();

  const [step, setStep] = useState(0);

  const form = useForm<z.infer<typeof createCustomTaskFieldSchema>>({
    resolver: zodResolver(createCustomTaskFieldSchema),
    defaultValues: {
      kind: "",
      name: "",
      visibility: "HIDDEN",
    },
  });

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
  };

  useEffect(() => {
    if (!open) {
      form.reset();
      setStep(0);
    }
  }, [open, form]);

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <CreateCustomFieldForm
        onCancel={onClose}
        form={form}
        step={step}
        setStep={setStep}
      />
    </ResponsiveModal>
  );
};

export { CreateCustomFieldModal };
