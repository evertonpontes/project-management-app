"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { EditCustomFieldForm } from "./edit-custom-field-form";
import { useEditCustomFieldModal } from "../hooks/use-edit-custom-field-modal";
import { ResponsiveModal } from "@/components/responsive-modal";
import { createCustomTaskFieldSchema } from "../schemas";
import { useEffect } from "react";

interface EditCustomFieldModalProps {
  useEditModal: ReturnType<typeof useEditCustomFieldModal>;
}

const EditCustomFieldModal = ({ useEditModal }: EditCustomFieldModalProps) => {
  const { open, setOpen, onClose, initialValues } = useEditModal;

  const form = useForm<z.infer<typeof createCustomTaskFieldSchema>>({
    resolver: zodResolver(createCustomTaskFieldSchema),
    defaultValues: initialValues ?? {
      kind: "",
      name: "",
      visibility: "HIDDEN",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
  };

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <EditCustomFieldForm
        onCancel={onClose}
        form={form}
        customFieldId={initialValues?.$id ?? ""}
      />
    </ResponsiveModal>
  );
};

export { EditCustomFieldModal };
