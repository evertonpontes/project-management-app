"use client";

import { Models } from "node-appwrite";
import { customTaskFieldIcons, updateCustomTaskFieldSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import {
  DotsThreeVerticalIcon,
  PencilSimpleLineIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditCustomFieldModal } from "../hooks/use-edit-custom-field-modal";
import z from "zod";

interface CustomFieldItemProps {
  field: Models.Row & {
    name: string;
    kind: string;
    visibility: "HIDDEN" | "VISIBLE";
    [key: string]: string;
  };

  useEditModal: ReturnType<typeof useEditCustomFieldModal>;
}

const CustomFieldItem = ({ field, useEditModal }: CustomFieldItemProps) => {
  const Icon = customTaskFieldIcons[field.kind];
  const { onOpen, setInitialValues, initialValues } = useEditModal;

  const handleUpdateCustomField = () => {
    const finalValues: z.infer<typeof updateCustomTaskFieldSchema> = {
      ...field,
    };

    switch (field.kind) {
      case "Currency":
        finalValues.currencySettings = JSON.parse(field.currencySettings);
        break;
      case "Dropdown":
        finalValues.dropdownSettings = JSON.parse(field.dropdownSettings);
        break;
      case "Number":
        finalValues.numberSettings = JSON.parse(field.numberSettings);
        break;
      case "People":
        finalValues.peopleSettings = JSON.parse(field.peopleSettings);
        break;
      case "Percent":
        finalValues.percentSettings = JSON.parse(field.percentSettings);
        break;
      case "Phone":
        finalValues.phoneSettings = JSON.parse(field.phoneSettings);
        break;
      default:
        break;
    }

    setInitialValues(finalValues);

    onOpen();
  };

  return (
    <div className="flex group items-center gap-4 justify-between w-full p-2 hover:bg-primary/10 rounded-md transition-all">
      <div className="flex items-center gap-2">
        <Icon className="size-6 md:size-5 text-muted-foreground" />
        <span className="text-base md:text-sm truncate">{field.name}</span>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="link"
                size="icon"
                className="invisible group-hover:visible transition-all"
              >
                <DotsThreeVerticalIcon className="size-6 md:size-5 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent className="w-50">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleUpdateCustomField}>
                <PencilSimpleLineIcon className="size-6 md:size-5 text-muted-foreground" />
                Edit custom field
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <TrashIcon className="size-6 md:size-5 text-destructive" />
                Edit custom field
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CustomFieldItem;
