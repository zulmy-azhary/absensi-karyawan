import { type SerializeFrom } from "@remix-run/node";
import type { UserType } from "~/types";
import { Button } from "~/components/ui/button";
import { UserCog2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import { UpdateUserForm } from "~/components/form/update-user-form";

type UpdateUserProps = {
  user: SerializeFrom<UserType>;
};

export const UpdateUserModal = ({ user }: UpdateUserProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="p-3">
          <UserCog2 className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UpdateUserForm user={user} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
