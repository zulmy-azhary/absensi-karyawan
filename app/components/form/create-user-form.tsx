import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { userSchema } from "~/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { CustomInput } from "~/components/ui/custom-input";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form } from "@remix-run/react";
import React from "react";
import { Button } from "~/components/ui/button";

type CreateUserFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateUserForm = ({ setOpen }: CreateUserFormProps) => {
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
      <Form
        method="post"
        onSubmit={(e) => {
          form.handleSubmit(e);
          if (form.formState.isValid) {
            setOpen(false);
            form.reset();
          }
        }}
        className="space-y-8 w-full"
      >
        <DialogHeader className="gap-y-8">
          <DialogTitle>Tambah Pengguna</DialogTitle>
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
        </DialogHeader>
        <DialogFooter className="justify-center">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Memproses..." : "Tambah Pengguna"}
          </Button>
        </DialogFooter>
      </Form>
    </RemixFormProvider>
  );
};
