"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCreateCustomFieldModal } from "../hooks/use-create-custom-field-modal";
import { CreateCustomFieldModal } from "./create-custom-field-modal";
import { useGetCustomFields } from "../api/use-get-custom-fields";
import { useParams } from "next/navigation";
import { Fragment } from "react/jsx-runtime";
import CustomFieldItem from "./custom-field-item";

const CustomFieldsList = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { onOpen } = useCreateCustomFieldModal();
  const { data: customFieldItems } = useGetCustomFields({ workspaceId });

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
        <div className="flex flex-col gap-2">
          {customFieldItems?.data.rows.map((field) => (
            <Fragment key={field.$id}>
              <CustomFieldItem field={field} />
            </Fragment>
          ))}
        </div>
        <Button className="w-full lg:w-fit" onClick={onOpen}>
          Create custom field
        </Button>
      </CardContent>
    </Card>
  );
};

export { CustomFieldsList };
