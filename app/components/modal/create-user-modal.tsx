import { Button } from "~/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { CreateUserForm } from "~/components/form/create-user-form";

export const CreateUserModal = () => {

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" className="lg:w-fit">
          Buat Pengguna
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <CreateUserForm />
      </AlertDialogContent>
    </AlertDialog>
  );
};
