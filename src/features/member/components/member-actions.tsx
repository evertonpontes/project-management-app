"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleEnum } from "../types";
import { Button } from "@/components/ui/button";
import { DotsThreeVerticalIcon, UserMinusIcon } from "@phosphor-icons/react";
import { useUpdateMember } from "../api/use-update-member";
import { useDeleteMember } from "../api/use-delete-member";

interface MemberActionProps {
  memberId: string;
}

const MemberActions = ({ memberId }: MemberActionProps) => {
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon">
            <DotsThreeVerticalIcon />
          </Button>
        }
      />
      <DropdownMenuContent className="w-50">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              updateMember({
                json: { role: RoleEnum.ADMIN },
                param: { memberId },
              })
            }
            disabled={isUpdatingMember || isDeletingMember}
          >
            Set as admin
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              updateMember({
                json: { role: RoleEnum.MEMBER },
                param: { memberId },
              })
            }
            disabled={isUpdatingMember || isDeletingMember}
          >
            Set as member
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => deleteMember({ param: { memberId } })}
            variant="destructive"
            disabled={isUpdatingMember || isDeletingMember}
          >
            Remove member
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemberActions;
