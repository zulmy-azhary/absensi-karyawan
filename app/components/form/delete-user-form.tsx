import { Form } from "@remix-run/react";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { deleteUserSchema } from "~/schemas/user.schema";
import type { z } from "zod";
import { useRemixForm } from "remix-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserType } from "~/types";
import { type SerializeFrom } from "@remix-run/node";

type DeleteUserFormProps = {
  user: SerializeFrom<UserType>;
};

export const DeleteUserForm = ({ user }: DeleteUserFormProps) => {
  const form = useRemixForm<z.infer<typeof deleteUserSchema>>({
    resolver: zodResolver(deleteUserSchema),
    defaultValues: {
      nik: user.nik,
    },
    submitData: {
      action: "DELETE",
    },
  });

  return (
    <Form method="post" onSubmit={form.handleSubmit} className="space-y-8 w-full">
      <AlertDialogHeader className="gap-y-2">
        <AlertDialogTitle className="text-center">
          Apakah anda yakin ingin menghapus akun ini?
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-col gap-y-0.5 text-center">
          <strong className="text-primary">Nama: {user.name}</strong>
          <strong className="text-primary">Nik: {user.nik}</strong>
        </AlertDialogDescription>
        <AlertDialogDescription className="text-center">
          Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun secara permanen dari server.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="justify-center">
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction type="submit">Hapus</AlertDialogAction>
      </AlertDialogFooter>
    </Form>
  );
};
