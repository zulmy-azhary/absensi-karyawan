import { CustomForm } from "~/components/ui/custom-form";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { userSchema } from "~/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { CustomInput } from "~/components/ui/custom-input";
import { Button } from "~/components/ui/button";

type CreateUserFormProps = {
  actionData: { message: string } | undefined;
};

export const CreateUserForm = ({ actionData }: CreateUserFormProps) => {
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
    <RemixFormProvider {...form}>
      <CustomForm actionData={actionData} method="post">
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Memproses..." : "Tambah Pengguna"}
        </Button>
      </CustomForm>
    </RemixFormProvider>
  );
};
