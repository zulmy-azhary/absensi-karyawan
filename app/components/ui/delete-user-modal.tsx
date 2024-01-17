import { Button } from "~/components/ui/button";
import { UserX2 } from "lucide-react";
import { type UserType } from "~/services/auth.server";
import { type SerializeFrom } from "@remix-run/node";
import { Form } from "@remix-run/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

type DeleteUserModalProps = {
  user: SerializeFrom<UserType>;
};

export default function DeleteUserModal({ user }: DeleteUserModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="p-3">
          <UserX2 className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form method="post">
          <AlertDialogHeader className="gap-y-2">
            <AlertDialogTitle className="text-center">
              Apakah anda yakin ingin menghapus akun ini?
            </AlertDialogTitle>
            <input type="hidden" name="nik" value={user.nik} />
            <AlertDialogDescription className="flex flex-col gap-y-0.5 text-center">
              <strong className="text-primary">Nama: {user.name}</strong>
              <strong className="text-primary">Nik: {user.nik}</strong>
            </AlertDialogDescription>
            <AlertDialogDescription className="text-center">
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun secara permanen dari
              server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction type="submit" name="_action" value="DELETE">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
