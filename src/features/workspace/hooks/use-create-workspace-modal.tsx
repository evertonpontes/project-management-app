"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

const useCreateWorkspaceModal = () => {
  const [open, setOpen] = useQueryState(
    "create-workspace",
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

export { useCreateWorkspaceModal };
