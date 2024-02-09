import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { userSchema } from "~/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { CustomInput } from "~/components/ui/custom-input";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Form } from "@remix-run/react";

export const CreateUserForm = () => {
  const form = useRemixForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      nik: "",
      password: "",
      confirmPassword: "",
    },
    submitData: {
      action: "CREATE",
    },
  });

  return (
    <RemixFormProvider {...form}>
      <Form method="post" onSubmit={form.handleSubmit} className="space-y-8 w-full">
        <AlertDialogHeader className="gap-y-8">
          <AlertDialogTitle>Tambah Pengguna</AlertDialogTitle>
          <div className="flex flex-col gap-y-2">
            <CustomInput
              name="name"
              label="Nama Lengkap"
              placeholder="Masukkan Nama Lengkap..."
              disabled={form.formState.isSubmitting}
            />
            <CustomInput
              name="nik"
              label="Nomor Induk Karyawan"
              placeholder="Masukkan Nomor Induk Karyawan..."
              disabled={form.formState.isSubmitting}
            />
            <CustomInput
              name="password"
              label="Password"
              type="password"
              placeholder="Masukkan Password..."
              disabled={form.formState.isSubmitting}
            />
            <CustomInput
              name="confirmPassword"
              label="Konfirmasi Password"
              type="password"
              placeholder="Masukkan Konfirmasi Password..."
              disabled={form.formState.isSubmitting}
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center">
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Memproses..." : "Tambah Pengguna"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </Form>
    </RemixFormProvider>
  );
};
