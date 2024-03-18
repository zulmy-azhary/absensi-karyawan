import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { Form } from "@remix-run/react";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { CustomInput } from "~/components/ui/custom-input";
import { Button } from "~/components/ui/button";
import type { z } from "zod";
import { updateUserSchema } from "~/schemas/user.schema";
import type { SerializeFrom } from "@remix-run/node";
import type { UserType } from "~/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

type UpdateUserFormProps = {
  user: SerializeFrom<UserType>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UpdateUserForm = ({ user, setOpen }: UpdateUserFormProps) => {
  const [isChangePassword, setChangePassword] = useState(false);

  const form = useRemixForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
    values: {
      name: user.name,
      nik: user.nik,
    },
    submitData: {
      action: "UPDATE",
    },
  });

  const handleChangePassword = () => {
    if (!isChangePassword) {
      setChangePassword(true);
      form.setValue("password", "");
      form.setValue("confirmPassword", "");
      return;
    }

    form.unregister(["password", "confirmPassword"]);
    setChangePassword(false);
  };

  return (
    <RemixFormProvider {...form}>
      <Form
        method="post"
        className="space-y-8 w-full"
        onSubmit={(e) => {
          form.handleSubmit(e);
          if (form.formState.isValid) {
            setOpen(false);
            form.reset();
          }
        }}
      >
        <DialogHeader className="gap-y-8">
          <DialogTitle>Ubah Pengguna</DialogTitle>
          <div className="flex flex-col gap-y-2">
            <CustomInput
              name="nik"
              label="Nomor Induk Karyawan"
              placeholder="Masukkan Nomor Induk Karyawan..."
              readOnly
            />
            <CustomInput
              name="name"
              label="Nama Lengkap"
              placeholder="Masukkan Nama Lengkap..."
              autoFocus
            />
            {isChangePassword ? (
              <>
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
              </>
            ) : null}
            <Button type="button" onClick={handleChangePassword}>
              {isChangePassword ? "Sembunyikan Password" : "Ubah Password"}
            </Button>
          </div>
        </DialogHeader>
        <DialogFooter className="justify-center">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Memproses..." : "Ubah"}
          </Button>
        </DialogFooter>
      </Form>
    </RemixFormProvider>
  );
};
