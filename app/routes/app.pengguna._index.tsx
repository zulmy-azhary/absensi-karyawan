import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UpdateUserModal } from "~/components/modal/update-user-modal";
import { DeleteUserModal } from "~/components/modal/delete-user-modal";
import { createUserAction, deleteUser, updateUser } from "~/actions/user.server";
import type { ActionType } from "~/types";
import { getUsers } from "~/services/user.server";
import { parseFormData } from "remix-hook-form";
import { toast } from "sonner";
import { CreateUserModal } from "~/components/modal/create-user-modal";

export const loader = async () => {
  const users = await getUsers();

  return json({ users });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const requestCloned = request.clone();
  const { action } = await parseFormData<{ action: ActionType }>(request);

  if (action === "CREATE") {
    return await createUserAction(requestCloned);
  }

  if (action === "UPDATE") {
    return await updateUser(requestCloned);
  }

  if (action === "DELETE") {
    return await deleteUser(requestCloned);
  }

  throw new Error("Unknown action.");
};

export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Daftar Pengguna" }];
};

export default function UserList() {
  const { users } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (!actionData) return;

    if (actionData.status === 200) {
      toast.success(actionData.message);
      return;
    }

    toast.error(actionData.message);
  }, [actionData]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Daftar Pengguna</h2>
      <Card className="px-6 py-8">
        <CreateUserModal />
        <Table className="mt-5 text-center border-y">
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead>Nomor Induk Karyawan</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Aktor</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .filter(({ role }) => role === "Karyawan")
              .map((user) => (
                <TableRow key={user.nik}>
                  <TableCell>{user.nik}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="flex justify-center gap-x-1">
                    <UpdateUserModal user={user} />
                    <DeleteUserModal user={user} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
