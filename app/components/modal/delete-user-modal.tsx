import { Button } from "~/components/ui/button";
import { UserX2 } from "lucide-react";
import type { UserType } from "~/types";
import { type SerializeFrom } from "@remix-run/node";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { DeleteUserForm } from "~/components/form/delete-user-form";

type DeleteUserModalProps = {
  user: SerializeFrom<UserType>;
};

export const DeleteUserModal = ({ user }: DeleteUserModalProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="p-3">
          <UserX2 className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <DeleteUserForm user={user} />
      </AlertDialogContent>
    </AlertDialog>
  );
};
