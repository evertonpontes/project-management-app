"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import CreateWorkspaceForm from "./create-workspace-form";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

const CreateWorkspaceModal = () => {
  const { open, setOpen, onClose } = useCreateWorkspaceModal();

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
  };

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <CreateWorkspaceForm onCancel={onClose} />
    </ResponsiveModal>
  );
};

export { CreateWorkspaceModal };
