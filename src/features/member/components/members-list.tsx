"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMembers } from "../api/use-get-members";
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MemberActions from "./member-actions";

const MembersList = () => {
  const params = useParams<{ workspaceId: string }>();
  const { data: members } = useGetMembers({ workspaceId: params.workspaceId });

  if (!members) return null;

  return (
    <Card>
      <CardContent className="flex justify-between flex-col gap-4 w-full">
        <CardHeader>
          <CardTitle>Members List</CardTitle>
        </CardHeader>
        <Separator className="w-full h-px" />
        <div className="w-full border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {members.data.total > 0
                ? members.data.documents.map((user, index) => (
                    <TableRow key={user.$id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarFallback>
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{members.data.rows[index].role}</TableCell>
                      <TableCell>
                        {formatDate(members.data.rows[index].$createdAt, "PPP")}
                      </TableCell>
                      <TableCell>
                        <MemberActions memberId={user.$id} />
                      </TableCell>
                    </TableRow>
                  ))
                : "Test"}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export { MembersList };
