import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import DeleteUserModal from "~/components/ui/delete-user-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import UpdateUserModal from "~/components/ui/update-user-modal";
import { useToast } from "~/components/ui/use-toast";
import { commitSession, getSession } from "~/services/session.server";
import { deleteUser, updateUser } from "~/actions/user.server";
import type { ActionType } from "~/types";
import { getUsers } from "~/services/user.server";
import { parseFormData } from "remix-hook-form";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const users = await getUsers();
  const session = await getSession(request.headers.get("Cookie"));
  const message = (session.get("successCreateUserKey") as string) || null;

  return json({ users, message }, { headers: { "Set-Cookie": await commitSession(session) } });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const requestCloned = request.clone();
  const { action } = await parseFormData<{ action: ActionType }>(request);

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
  const { users, message } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();

  useEffect(() => {
    if (!actionData && !message) return;
    toast({ description: message || actionData?.message });
  }, [actionData, message, toast]);

  return (
    <div className="flex flex-col gap-y-5">
      <h2 className="text-lg font-medium mb-6">Daftar Pengguna</h2>
      <Card className="px-6 py-8">
        <Button variant="default" className="lg:w-fit" asChild>
          <Link to="/app/pengguna/tambah">Tambah Pengguna</Link>
        </Button>
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
