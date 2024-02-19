import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { CreateUserForm } from "~/components/form/create-user-form";
import { useState } from "react";

export const CreateUserModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="lg:w-fit">
          Buat Pengguna
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CreateUserForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
