import { type SerializeFrom } from "@remix-run/node";
import { type UserType } from "~/services/auth.server";
import { Button } from "~/components/ui/button";
import { UserCog2 } from "lucide-react";
import { updateUserValidator } from "~/schemas/user.schema";
import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { InputWithLabel } from "~/components/ui/input-with-label";
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

type UpdateUserProps = {
  user: SerializeFrom<UserType>;
  actionData?: SerializeFrom<{ message: string }>;
};

const UPDATE_ID = "updateUserForm";

export default function UpdateUserModal(props: UpdateUserProps) {
  const isSubmitting = useIsSubmitting(UPDATE_ID);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="p-3">
          <UserCog2 className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ValidatedForm
          id={UPDATE_ID}
          method="post"
          validator={updateUserValidator}
          className="space-y-8 w-full"
          onSubmit={() => setOpen(false)}
        >
          <DialogHeader className="gap-y-8">
            <DialogTitle>Ubah Pengguna</DialogTitle>
            <div className="flex flex-col gap-y-2">
              <InputWithLabel
                label="Nomor Induk Karyawan"
                input="nik"
                placeholder="Masukkan Nomor Induk Karyawan..."
                defaultValue={props.user.nik}
                readOnly
              />
              <InputWithLabel
                label="Nama Lengkap"
                input="name"
                placeholder="Masukkan Nama Lengkap..."
                defaultValue={props.user.name}
                autoFocus
              />
              <InputWithLabel
                label="Password"
                input="password"
                type="password"
                placeholder="Masukkan Password..."
              />
              <InputWithLabel
                label="Konfirmasi Password"
                input="confirmPassword"
                type="password"
                placeholder="Masukkan Konfirmasi Password..."
              />
            </div>
          </DialogHeader>
          <DialogFooter className="justify-center">
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" name="_action" value="UPDATE" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Ubah"}
            </Button>
          </DialogFooter>
        </ValidatedForm>
      </DialogContent>
    </Dialog>
  );
}
