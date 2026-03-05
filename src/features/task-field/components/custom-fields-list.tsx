"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCreateCustomFieldModal } from "../hooks/use-create-custom-field-modal";
import { useGetCustomFields } from "../api/use-get-custom-fields";
import { useParams } from "next/navigation";
import { Fragment } from "react/jsx-runtime";
import CustomFieldItem from "./custom-field-item";
import { EditCustomFieldModal } from "./edit-custom-field-modal";
import { useEditCustomFieldModal } from "../hooks/use-edit-custom-field-modal";
import { CreateCustomFieldModal } from "./create-custom-field-modal";

const CustomFieldsList = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { onOpen } = useCreateCustomFieldModal();
  const { data: customFieldItems } = useGetCustomFields({ workspaceId });

  const useEditModal = useEditCustomFieldModal();

  return (
    <>
      <CreateCustomFieldModal />
      <EditCustomFieldModal useEditModal={useEditModal} />
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Task custom fields
          </CardTitle>
        </CardHeader>
        <Separator className="w-full h-px" />
        <CardContent className="flex gap-4 flex-col w-full">
          <div className="flex flex-col gap-2 w-full max-w-md">
            {customFieldItems?.data.rows.map((field) => (
              <Fragment key={field.$id}>
                <CustomFieldItem field={field} useEditModal={useEditModal} />
              </Fragment>
            ))}
          </div>
          <Button className="w-full lg:w-fit" onClick={onOpen}>
            Create custom field
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export { CustomFieldsList };
