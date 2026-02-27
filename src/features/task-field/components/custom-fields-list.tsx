"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCreateCustomFieldModal } from "../hooks/use-create-custom-field-modal";
import { CreateCustomFieldModal } from "./create-custom-field-modal";

const CustomFieldsList = () => {
  const { onOpen } = useCreateCustomFieldModal();

  return (
    <Card>
      <CreateCustomFieldModal />
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Task custom fields
        </CardTitle>
      </CardHeader>
      <Separator className="w-full h-px" />
      <CardContent className="flex gap-4 flex-col w-full">
        Enter
        <Button className="w-full lg:w-fit" onClick={onOpen}>
          Create custom field
        </Button>
      </CardContent>
    </Card>
  );
};

export { CustomFieldsList };
