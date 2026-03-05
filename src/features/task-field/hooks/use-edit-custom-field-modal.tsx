"use client";

import { parseAsBoolean, useQueryState } from "nuqs";
import z from "zod";
import { updateCustomTaskFieldSchema } from "../schemas";
import { useState } from "react";
import { Models } from "node-appwrite";

const useEditCustomFieldModal = () => {
  const [open, setOpen] = useQueryState(
    "edit-custom-field",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const [initialValues, setInitialValues] = useState<
    (Models.Row & z.infer<typeof updateCustomTaskFieldSchema>) | undefined
  >();

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setInitialValues(undefined);
    setOpen(false);
  };

  return {
    open,
    onOpen,
    onClose,
    setOpen,
    initialValues,
    setInitialValues,
  };
};

export { useEditCustomFieldModal };
