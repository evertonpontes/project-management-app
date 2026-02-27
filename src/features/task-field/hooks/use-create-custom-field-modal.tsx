"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

const useCreateCustomFieldModal = () => {
  const [open, setOpen] = useQueryState(
    "create-custom-field",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
  );

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return {
    open,
    onOpen,
    onClose,
    setOpen,
  };
};

export { useCreateCustomFieldModal };
