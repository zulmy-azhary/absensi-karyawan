import { type SerializeFrom } from "@remix-run/node";
import type { UserType } from "~/types";
import { Button } from "~/components/ui/button";
import { UserCog2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState } from "react";
import { CustomInput } from "~/components/ui/custom-input";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import type { z } from "zod";
import { updateUserSchema } from "~/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@remix-run/react";

type UpdateUserProps = {
  user: SerializeFrom<UserType>;
};

export default function UpdateUserModal({ user }: UpdateUserProps) {
  const [open, setOpen] = useState(false);
  const form = useRemixForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
    values: {
      name: user.name,
      nik: user.nik,
      password: "",
      confirmPassword: "",
    },
    submitData: {
      action: "UPDATE",
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="p-3">
          <UserCog2 className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
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
      </DialogContent>
    </Dialog>
  );
}
