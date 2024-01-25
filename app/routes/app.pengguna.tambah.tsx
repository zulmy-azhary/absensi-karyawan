import { type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import CustomForm from "~/components/ui/custom-form";
import { createUserAction } from "~/actions/user.server";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { userSchema } from "~/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { CustomInput } from "~/components/ui/custom-input";
import { Button } from "~/components/ui/button";

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

  const form = useRemixForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      nik: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Tambah Pengguna</h2>
      <div className="flex flex-col items-center">
        <RemixFormProvider {...form}>
          <CustomForm actionData={actionData} method="post">
            <CustomInput name="name" label="Nama Lengkap" placeholder="Masukkan Nama Lengkap..." />
            <CustomInput
              name="nik"
              label="Nomor Induk Karyawan"
              placeholder="Masukkan Nomor Induk Karyawan..."
            />
            <CustomInput
              name="password"
              label="Password"
              type="password"
              placeholder="Masukkan Password..."
            />
            <CustomInput
              name="confirmPassword"
              label="Konfirmasi Password"
              type="password"
              placeholder="Masukkan Konfirmasi Password..."
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Memproses..." : "Tambah pengguna"}
            </Button>
          </CustomForm>
        </RemixFormProvider>
      </div>
    </div>
  );
}
