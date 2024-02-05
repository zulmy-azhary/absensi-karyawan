import { type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { createUserAction } from "~/actions/user.server";
import { CreateUserForm } from "~/components/form/create-user-form";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    return await createUserAction(request);
  } catch (error: unknown) {
    return error as Error;
  }
};

export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Tambah Pengguna" }];
};

export default function CreateUser() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Tambah Pengguna</h2>
      <div className="flex flex-col items-center">
        <CreateUserForm actionData={actionData} />
      </div>
    </div>
  );
}
